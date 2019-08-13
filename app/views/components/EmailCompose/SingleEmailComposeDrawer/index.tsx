import { Field } from 'react-final-form'

import React, { HTMLProps, useState } from 'react'

import { InputProps } from '@material-ui/core/Input'

import { TextFieldProps } from '@material-ui/core/TextField'

import EmailComposeDrawer from 'components/EmailCompose/EmailComposeDrawer'

import { getSendEmailResultMessages } from 'components/EmailCompose/helpers/email-result-messages'

import { sendEmail } from 'models/email-compose/send-email'

import ContactsChipsInput from 'components/ContactsChipsInput'

import { normalizeRecipients } from '../helpers/normalize-recepients'
import { From } from '../fields/From'
import { EmailComposeDrawerProps, EmailFormValues } from '../types'
import { CcBccButtons } from '../fields/CcBccButtons'
import { CollapsedRecipients } from '../components/CollapsedRecipients'

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

  const renderFields = (values: EmailFormValues) => (
    <>
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
            inputProps: {
              autoFocus: true
            } as HTMLProps<HTMLInputElement>
          } as TextFieldProps
        }
      />
      {hasCc && (
        <Field label="Cc" name="cc" component={ContactsChipsInput as any} />
      )}
      {hasBcc && (
        <Field label="Bcc" name="bcc" component={ContactsChipsInput as any} />
      )}
    </>
  )
  const renderCollapsedFields = (values: EmailFormValues) => (
    <CollapsedRecipients recipients={values.recipients || []} label="To" />
  )

  return (
    <EmailComposeDrawer
      {...otherProps}
      hasSignatureByDefault
      sendEmail={handleSendEmail}
      getSendEmailResultMessages={form =>
        getSendEmailResultMessages(!!form.due_at)
      }
      renderCollapsedFields={renderCollapsedFields}
      renderFields={renderFields}
    />
  )
}
