import { OAuthProvider } from 'constants/contacts'

import * as React from 'react'
import { ComponentProps, useCallback, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { OnChange } from 'react-final-form-listeners'

import useEffectOnce from 'react-use/lib/useEffectOnce'

import { sendEmailViaOauthAccount } from 'models/o-auth-accounts/send-email-via-o-auth-account'
import { IAppState } from 'reducers'
import {
  IOauthAccountsState,
  selectAllConnectedAccounts
} from 'reducers/contacts/oAuthAccounts'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'

import {
  uploadEmailAttachment,
  uploadGoogleAttachment,
  uploadMicrosoftAttachment
} from 'models/email/upload-email-attachment'

import EmailComposeForm from './EmailComposeForm'
import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import { EmailRecipientsFields } from './fields/EmailRecipientsFields'
import { parseEmailRecipient } from '../EmailRecipientsChipsInput/helpers/parse-email-recipient'

import { oAuthAccountTypeToProvider } from '../../../components/Pages/Dashboard/Account/ConnectedAccounts/constants'

import { useExpressionEvaluator } from './EmailComposeForm/use-expression-evaluator'

import { EmailFormValues } from '.'

interface Props
  extends Omit<
    ComponentProps<typeof EmailComposeForm>,
    | 'sendEmail'
    | 'isSubmitDisabled'
    | 'renderCollapsedFields'
    | 'renderFields'
    | 'enableSchedule'
    | 'uploadAttachment'
  > {
  getEmail?: (
    email: IEmailThreadEmailInput,
    fromAccount: IOAuthAccount
  ) => IEmailThreadEmailInput

  oAuthAccounts: IOauthAccountsState
  fetchOAuthAccounts: typeof fetchOAuthAccounts
}

function EmailThreadComposeForm({
  onSent,
  fetchOAuthAccounts,
  oAuthAccounts,
  getEmail = i => i,
  ...props
}: Props) {
  const [from, setFrom] = useState(
    (props.initialValues && props.initialValues.from) || null
  )
  const { evaluate } = useExpressionEvaluator()

  const handleSendEmail = async (formValue: EmailFormValues) => {
    const from = formValue.from!
    const account = getFromAccount(from.value)!
    const provider = oAuthAccountTypeToProvider[account.type]

    const html = await evaluate(formValue.body || '', formValue)
    const emailData: IEmailThreadEmailInput = getEmail(
      {
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
        html,
        attachments: (formValue.attachments || []).map<IEmailAttachmentInput>(
          ({ mime: type, name: filename, url: link }) => ({
            filename,
            isInline: false,
            link,
            type
          })
        )
      },
      account
    )
    const newEmail = await sendEmailViaOauthAccount(
      provider,
      account.id,
      emailData
    )

    onSent && onSent(newEmail)

    return newEmail
  }

  useEffectOnce(() => {
    Object.entries(oAuthAccounts.loading).forEach(
      ([provider, loading]: [OAuthProvider, boolean | null]) => {
        if (loading === null) {
          fetchOAuthAccounts(provider)
        }
      }
    )
  })

  const allAccounts = selectAllConnectedAccounts(oAuthAccounts)

  const getFromAccount = useCallback(
    (accountId: UUID) => allAccounts.find(account => account.id === accountId),
    [allAccounts]
  )

  const fromOptions: EmailFormValues['from'][] = useMemo(
    () =>
      allAccounts.map(account => ({
        label: `${account.display_name} <${account.email}>`,
        value: account.id
      })),
    [allAccounts]
  )

  const isSubmitDisabled = useCallback(
    values => {
      const accountId = values.from && values.from.value

      return !accountId || !getFromAccount(accountId)
    },
    [getFromAccount]
  )

  /**
   * There are different endpoints for uploading attachment based on email
   * provider. Though we don't necessarily need to use those.
   */
  const uploadAttachment = useCallback(
    (file: File | IFile) => {
      const account = from && getFromAccount(from.value)

      switch (account && oAuthAccountTypeToProvider[account.type]) {
        case OAuthProvider.Google:
          return uploadGoogleAttachment(account!.id, file)
        case OAuthProvider.Outlook:
          return uploadMicrosoftAttachment(account!.id, file)
        default:
          return uploadEmailAttachment(file)
      }
    },
    [from, getFromAccount]
  )

  return (
    <EmailComposeForm
      {...props}
      sendEmail={handleSendEmail}
      enableSchedule={false}
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
    >
      <OnChange name="from">{setFrom}</OnChange>
    </EmailComposeForm>
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

function isEmailRecipient(
  recipient: IDenormalizedEmailRecipientInput
): recipient is IDenormalizedEmailRecipientEmailInput {
  return recipient.recipient_type === 'Email'
}
