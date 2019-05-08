import { Field } from 'react-final-form'

import React, { useState } from 'react'

import EmailComposeDrawer from 'components/EmailCompose/EmailComposeDrawer'

import { MultipleContactsSelect } from 'components/Forms/MultipleContactsSelect'

import { To } from '../fields/To'

export function SingleEmailComposeDrawer({ getEmail, ...otherProps }) {
  const [hasCc, setCc] = useState(false)
  const [hasBcc, setBcc] = useState(false)

  const sendEmail = formValue =>
    sendEmail(
      getEmail({
        from: formValue.fromId,
        to: formValue.recipients,
        cc: formValue.cc,
        bcc: formValue.bcc,
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
        placeholder="To"
        name="recipients"
        component={To}
        showCc={!hasCc}
        showBcc={!hasBcc}
        onCcAdded={() => setCc(true)}
        onBccAdded={() => setBcc(true)}
      />
      {hasCc && (
        <Field placeholder="Cc" name="cc" component={MultipleContactsSelect} />
      )}
      {hasBcc && (
        <Field
          placeholder="Bcc"
          name="bcc"
          component={MultipleContactsSelect}
        />
      )}
    </EmailComposeDrawer>
  )
}
