import * as React from 'react'
import { useMemo } from 'react'

import { sendEmailViaOauthAccount } from 'models/o-auth-accounts/send-email-via-o-auth-account'
import { useRerenderOnChange } from 'hooks/use-rerender-on-change'

import { EmailResponseType } from '../EmailThread/types'
import EmailComposeForm from './EmailComposeForm'
import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import { EmailRecipientsFields } from './fields/EmailRecipientsFields'
import { getReplyRecipients } from './helpers/get-reply-recipients'
import { getEmailProvider } from './helpers/get-email-provider'
import { getReplyHtml } from './helpers/get-reply-html'
import { getForwardHtml } from './helpers/get-forward-html'
import { parseEmailRecipient } from '../EmailRecipientsChipsInput/helpers/parse-email-recipient'

import { getReplySubject } from './helpers/get-reply-subject'

import { EmailFormValues } from '.'

interface Props {
  responseType: EmailResponseType
  email: IEmailThreadEmail
  onCancel: () => void
  onSent?: () => void
}

export function EmailThreadComposeForm({
  responseType,
  email,
  onCancel,
  onSent
}: Props) {
  const handleSendEmail = async (formValue: EmailFormValues) => {
    const owner = email.owner
    const provider = getEmailProvider(email)

    if (owner && provider) {
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

      console.log(emailData)

      return sendEmailViaOauthAccount(provider, owner, emailData)
    }
  }

  const initialValue = useMemo<EmailFormValues>(() => {
    const { to, cc } =
      responseType === 'reply' ? getReplyRecipients(email) : { to: [], cc: [] }

    const from = getEmailRecipient(
      email.owner_email || '',
      email.owner_name || ''
    )

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

  return (
    shouldRender && (
      <EmailComposeForm
        hasSignatureByDefault
        sendEmail={handleSendEmail}
        enableSchedule={false}
        onCancel={onCancel}
        initialValues={initialValue}
        renderCollapsedFields={(values: EmailFormValues) => (
          <CollapsedEmailRecipients
            to={values.to || []}
            cc={values.cc || []}
            bcc={values.bcc || []}
          />
        )}
        onSent={onSent}
        renderFields={values => (
          <EmailRecipientsFields
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
