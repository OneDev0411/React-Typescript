import { Field } from 'react-final-form'

import React, { useState } from 'react'

import EmailComposeDrawer from 'components/EmailCompose/EmailComposeDrawer'

import { getSendEmailResultMessages } from 'components/EmailCompose/helpers/email-result-messages'

import { sendEmail } from 'models/email-compose/send-email'

import ContactsChipsInput from 'components/ContactsChipsInput'

import { normalizeRecipients } from '../helpers/normalize-recepients'

export function SingleEmailComposeDrawer({
  getEmail = email => email,
  disableAddNewRecipient = false,
  ...otherProps
}) {
  const [hasCc, setCc] = useState(false)
  const [hasBcc, setBcc] = useState(false)

  const handleSendEmail = formValue =>
    sendEmail(
      getEmail({
        from: formValue.fromId,
        to: normalizeRecipients(formValue.recipients),
        cc: normalizeRecipients(formValue.cc),
        bcc: normalizeRecipients(formValue.bcc),
        subject: (formValue.subject || '').trim(),
        html: formValue.body || '',
        attachments: formValue.attachments.map(item => item.file_id),
        due_at: formValue.due_at
      })
    )

  return (
    // @ts-ignore FIXME
    <EmailComposeDrawer
      {...otherProps}
      hasSignatureByDefault
      hasTemplateVariables
      sendEmail={handleSendEmail}
      getSendEmailResultMessages={form =>
        getSendEmailResultMessages(1, !!form.due_at)
      }
    >
      <Field
        label="To"
        name="recipients"
        component={ContactsChipsInput as any}
        disableAddNewRecipient={disableAddNewRecipient}
        showCc={!hasCc}
        showBcc={!hasBcc}
        onCcAdded={() => setCc(true)}
        onBccAdded={() => setBcc(true)}
      />
      {hasCc && <Field label="Cc" name="cc" component={ContactsChipsInput} />}
      {hasBcc && (
        <Field label="Bcc" name="bcc" component={ContactsChipsInput} />
      )}
    </EmailComposeDrawer>
  )
}
