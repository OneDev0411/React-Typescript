import * as React from 'react'
import { useEffect, useMemo, useState } from 'react'

import usePrevious from 'react-use/lib/usePrevious'

import { EmailResponseType } from '../EmailThread/types'
import EmailComposeForm from './EmailComposeForm'

import { normalizeRecipients } from './helpers/normalize-recepients'

import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import { EmailRecipientsFields } from './fields/EmailRecipientsFields'

import { getReplyRecipients } from './helpers/get-reply-recipients'

import { EmailFormValues } from './index'

interface Props {
  responseType: EmailResponseType
  email: IEmailThreadEmail
  onCancel: () => void
  onSent: () => void
}

export function EmailThreadComposeForm({
  responseType,
  email,
  onCancel,
  onSent
}: Props) {
  const handleSendEmail = async (formValue: EmailFormValues) => {
    const emailData = {
      to: normalizeRecipients((formValue.to || []).filter(isEmailRecipient)),
      cc: normalizeRecipients((formValue.cc || []).filter(isEmailRecipient)),
      bcc: normalizeRecipients((formValue.bcc || []).filter(isEmailRecipient)),
      subject: (formValue.subject || '').trim(),
      html: formValue.body || '',
      attachments: (formValue.attachments || []).map(item => item.id)
    }

    console.log(emailData)
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
      body: '', // TODO
      due_at: null,
      attachments: [],
      subject: `${responseType === 'reply' ? 'Re' : 'Fwd'}: ${email.subject}`
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

function getEmailRecipient(email: string, displayName: string): string {
  return displayName ? `${displayName} <${email}>` : email
}

function isEmailRecipient(recipient: IDenormalizedEmailRecipientInput) {
  return recipient.recipient_type === 'Email'
}

function useRerenderOnChange(value: any): true | null {
  const [shouldRender, setShouldRender] = useState(true)
  const previousValue = usePrevious(value)

  useEffect(() => {
    if (value !== previousValue && previousValue !== undefined) {
      setShouldRender(false)

      setTimeout(() => {
        setShouldRender(true)
      })
    }
  }, [value, previousValue])

  return shouldRender || null
}
