import { Field } from 'react-final-form'

import React, { useState } from 'react'

import { InputProps } from '@material-ui/core/Input'

import { TextFieldProps } from '@material-ui/core/TextField'

import EmailComposeDrawer from 'components/EmailCompose/EmailComposeDrawer'

import { getSendEmailResultMessages } from 'components/EmailCompose/helpers/email-result-messages'

import { sendEmail } from 'models/email-compose/send-email'

import ContactsChipsInput from 'components/ContactsChipsInput'

import { normalizeRecipients } from '../helpers/normalize-recepients'
import { From } from '../fields/From'
import { EmailComposeDrawerProps } from '../types'
import { CcBccButtons } from '../fields/CcBccButtons'

interface Props extends EmailComposeDrawerProps {
  getEmail?: (values: IEmailCampaignInput) => IEmailCampaignInput
  disableAddNewRecipient?: boolean
}

export function SingleEmailComposeDrawer({
  getEmail = email => email,
  disableAddNewRecipient = false,
  ...otherProps
}: Props) {
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
        component={From}
        name="from"
        InputProps={
          {
            endAdornment: disableAddNewRecipient ? null : (
              <CcBccButtons
                showCc={!hasCc}
                showBcc={!hasBcc}
                onCcAdded={() => setCc(true)}
                onBccAdded={() => setBcc(true)}
              />
            )
          } as InputProps
        }
      />

      <Field
        label="To"
        name="recipients"
        component={ContactsChipsInput as any}
        readOnly={disableAddNewRecipient}
        TextFieldProps={
          {
            InputProps: {
              onBlur: () => {
                console.log('blur')
              },
              inputProps: {
                autoFocus: true
              }
            } as InputProps
          } as TextFieldProps
        }
      />
      {hasCc && (
        <Field label="Cc" name="cc" component={ContactsChipsInput as any} />
      )}
      {hasBcc && (
        <Field label="Bcc" name="bcc" component={ContactsChipsInput as any} />
      )}
    </EmailComposeDrawer>
  )
}
