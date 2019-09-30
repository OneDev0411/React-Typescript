import * as React from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { connect } from 'react-redux'

import { createStyles, makeStyles, Theme } from '@material-ui/core'

import { sendEmailViaOauthAccount } from 'models/o-auth-accounts/send-email-via-o-auth-account'
import { useRerenderOnChange } from 'hooks/use-rerender-on-change'
import { IAppState } from 'reducers'
import { IOauthAccountsState } from 'reducers/contacts/oAuthAccounts'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import {
  uploadEmailAttachment,
  uploadGoogleAttachment,
  uploadMicrosoftAttachment
} from 'models/email/upload-email-attachment'

import { EmailResponseType } from '../EmailThread/types'
import EmailComposeForm from './EmailComposeForm'
import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import { EmailRecipientsFields } from './fields/EmailRecipientsFields'
import { getReplyRecipients } from './helpers/get-reply-recipients'
import { getReplyHtml } from './helpers/get-reply-html'
import { getForwardHtml } from './helpers/get-forward-html'
import { parseEmailRecipient } from '../EmailRecipientsChipsInput/helpers/parse-email-recipient'
import { getReplySubject } from './helpers/get-reply-subject'

import { oAuthAccountTypeToProvider } from '../../../components/Pages/Dashboard/Account/ConnectedAccounts/consants'

import { EmailFormValues } from '.'

interface Props {
  responseType: EmailResponseType
  email: IEmailThreadEmail
  onCancel: () => void
  onSent?: (email: IEmailThreadEmail) => void
  oAuthAccounts: IOauthAccountsState
  fetchOAuthAccounts: () => Promise<any>
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles({
      footer: {
        position: 'sticky',
        bottom: 0,
        zIndex: 2,
        background: theme.palette.background.paper
      }
    }),
  { name: 'EmailThreadComposeForm' }
)

export function EmailThreadComposeForm({
  responseType,
  email,
  onCancel,
  onSent,
  fetchOAuthAccounts,
  oAuthAccounts
}: Props) {
  const classes = useStyles()

  const handleSendEmail = async (formValue: EmailFormValues) => {
    const from = formValue.from!

    const account = getFromAccount(from.value)!

    const emailData: IEmailThreadEmailInput = {
      subject: (formValue.subject || '').trim(),
      to: (formValue.to || [])
        .filter(isEmailRecipient)
        .map(toEmailThreadRecipient),
      cc: (formValue.cc || [])
        .filter(isEmailRecipient)
        .map(toEmailThreadRecipient),
      bcc: (formValue.bcc || [])
        .filter(isEmailRecipient)
        .map(toEmailThreadRecipient),
      html: formValue.body || '',
      threadId: email.thread_id,
      messageId: email.message_id,
      inReplyTo: email.internet_message_id,
      attachments: (formValue.attachments || []).map<IEmailAttachmentInput>(
        item => ({
          contentId: item.name,
          filename: item.name,
          isInline: false,
          link: item.url,
          type: item.mime
        })
      )
    }
    const newEmail = await sendEmailViaOauthAccount(
      oAuthAccountTypeToProvider[account.type],
      account.id,
      emailData
    )

    onSent && onSent(newEmail)

    return newEmail
  }

  useEffect(() => {
    if (
      getAllAccounts().length === 0 &&
      Object.values(oAuthAccounts.loading).some(loading => !loading)
    ) {
      fetchOAuthAccounts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const initialValue = useMemo<EmailFormValues>(() => {
    const { to, cc } =
      responseType === 'reply' ? getReplyRecipients(email) : { to: [], cc: [] }

    const owner = email.owner
    const from = owner
      ? {
          label: getEmailRecipient(
            email.owner_email || '',
            email.owner_name || ''
          ),
          value: owner
        }
      : undefined

    return {
      from,
      to,
      cc,
      bcc: [],
      body:
        responseType === 'reply' ? getReplyHtml(email) : getForwardHtml(email),
      due_at: null,
      attachments: [],
      subject: getReplySubject(responseType, email)
    }
  }, [email, responseType])

  const shouldRender = useRerenderOnChange(responseType)

  const getAllAccounts = useCallback(() => {
    return Object.values(oAuthAccounts.list)
      .flat()
      .filter(account => !account.revoked)
  }, [oAuthAccounts.list])

  const getFromAccount = useCallback(
    (accountId: string) =>
      getAllAccounts().find(account => account.id === accountId),
    [getAllAccounts]
  )

  const fromOptions: EmailFormValues['from'][] = useMemo(
    () =>
      getAllAccounts().map(account => ({
        label: `${account.display_name} <${account.email}>`,
        value: account.id
      })),
    [getAllAccounts]
  )

  const isSubmitDisabled = useCallback(
    values => {
      const accountId = values.from && values.from.value

      return !accountId || !getFromAccount(accountId)
    },
    [getFromAccount]
  )

  const uploadAttachment = useCallback(
    (file: File | IFile) => {
      switch (email.origin) {
        case 'gmail':
          return uploadGoogleAttachment(email.owner!, file)
        case 'outlook':
          return uploadMicrosoftAttachment(email.owner!, file)
        default:
          return uploadEmailAttachment(file)
      }
    },
    [email.origin, email.owner]
  )

  return (
    shouldRender && (
      <EmailComposeForm
        classes={{ footer: classes.footer }}
        hasSignatureByDefault
        sendEmail={handleSendEmail}
        enableSchedule={false}
        onCancel={onCancel}
        initialValues={initialValue}
        isSubmitDisabled={isSubmitDisabled}
        uploadAttachment={uploadAttachment}
        renderCollapsedFields={(values: EmailFormValues) => (
          <CollapsedEmailRecipients
            to={values.to || []}
            cc={values.cc || []}
            bcc={values.bcc || []}
          />
        )}
        renderFields={values => (
          <EmailRecipientsFields
            fromOptions={fromOptions}
            EmailRecipientsChipsInputProps={{
              suggestTags: false,
              suggestLists: false
            }}
            includeQuickSuggestions={false}
            values={values}
          />
        )}
      />
    )
  )
}

export default connect(
  ({ contacts: { oAuthAccounts } }: IAppState) => ({
    oAuthAccounts
  }),
  { fetchOAuthAccounts }
)(EmailThreadComposeForm)

function toEmailThreadRecipient(
  recipient: IDenormalizedEmailRecipientEmailInput
): IEmailThreadRecipient {
  const { displayName: name, emailAddress: address } = parseEmailRecipient(
    recipient.email
  )

  return { address, name }
}

function getEmailRecipient(email: string, displayName: string): string {
  return displayName ? `${displayName} <${email}>` : email
}

function isEmailRecipient(
  recipient: IDenormalizedEmailRecipientInput
): recipient is IDenormalizedEmailRecipientEmailInput {
  return recipient.recipient_type === 'Email'
}
