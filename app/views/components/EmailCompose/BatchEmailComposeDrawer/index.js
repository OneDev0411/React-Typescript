import React from 'react'

import { Field } from 'react-final-form'

import { MultipleContactsSelect } from 'components/Forms/MultipleContactsSelect'

import { sendMultipleEmails } from 'models/email-compose/send-contacts-email'

import EmailComposeDrawer from '../EmailComposeDrawer'

export function BatchEmailComposeDrawer({
  getEmail,
  disableAddNewRecipient,
  ...otherProps
}) {
  const sendEmail = formValue =>
    sendMultipleEmails(
      getEmail({
        from: formValue.fromId,
        to: formValue.recipients,
        subject: (formValue.subject || '').trim(),
        html: formValue.body,
        attachments: Object.values(formValue.attachments).map(
          item => item.file_id
        ),
        due_at: formValue.due_at
      })
    )

  return (
    <EmailComposeDrawer {...otherProps} sendEmail={sendEmail}>
      <Field
        placeholder="Bcc"
        name="recipients"
        disableAddNewRecipient={disableAddNewRecipient}
        component={MultipleContactsSelect}
      />
    </EmailComposeDrawer>
  )
}
