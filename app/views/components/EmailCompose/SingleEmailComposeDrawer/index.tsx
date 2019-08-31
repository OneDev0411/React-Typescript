import { Field } from 'react-final-form'

import React, { ComponentProps, HTMLProps, useState } from 'react'

import { InputProps } from '@material-ui/core/Input'

import { TextFieldProps } from '@material-ui/core/TextField'

import EmailComposeDrawer from 'components/EmailCompose/EmailComposeDrawer'

import { getSendEmailResultMessages } from 'components/EmailCompose/helpers/email-result-messages'

import { createEmailCampaign } from 'models/email/create-email-campaign'

import EmailRecipientsChipsInput from 'components/EmailRecipientsChipsInput'

import { updateEmailCampaign } from 'models/email/update-email-campaign'

import { normalizeRecipients } from '../helpers/normalize-recepients'
import { From } from '../fields/From'
import { EmailFormValues } from '../types'
import { CcBccButtons } from '../components/CcBccButtons'
import { CollapsedRecipients } from '../components/CollapsedRecipients'

interface Props
  extends Omit<
    ComponentProps<typeof EmailComposeDrawer>,
    | 'hasSignatureByDefault'
    | 'sendEmail'
    | 'getSendEmailResultMessages'
    | 'renderCollapsedFields'
    | 'renderFields'
  > {
  getEmail?: (values: IEmailCampaignInput) => IEmailCampaignInput
  disableAddNewRecipient?: boolean
  /**
   * If set, it's used to update an already existing scheduled/draft email
   */
  emailId?: string
}

export function SingleEmailComposeDrawer({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  ...otherProps
}: Props) {
  const [hasCc, setCc] = useState(false)
  const [hasBcc, setBcc] = useState(false)

  const handleSendEmail = (formValue: EmailFormValues) => {
    const emailData = getEmail({
      from: (formValue.from && formValue.from.id) || '',
      to: normalizeRecipients(formValue.to),
      cc: normalizeRecipients(formValue.cc),
      bcc: normalizeRecipients(formValue.bcc),
      subject: (formValue.subject || '').trim(),
      html: formValue.body || '',
      attachments: (formValue.attachments || []).map(item => item.id),
      due_at: formValue.due_at
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createEmailCampaign(emailData)
  }

  const renderFields = (values: EmailFormValues) => {
    const isCcShown = hasCc || (values.cc || []).length > 0
    const isBccShown = hasBcc || (values.bcc || []).length > 0

    return (
      <>
        <Field
          component={From}
          name="from"
          InputProps={
            {
              endAdornment: disableAddNewRecipient ? null : (
                <CcBccButtons
                  showCc={!isCcShown}
                  showBcc={!isBccShown}
                  onCcAdded={() => setCc(true)}
                  onBccAdded={() => setBcc(true)}
                />
              )
            } as InputProps
          }
        />

        <Field
          name="bcc"
          render={bccInputProps => (
            <Field
              label="To"
              name="to"
              component={EmailRecipientsChipsInput as any}
              readOnly={disableAddNewRecipient}
              includeQuickSuggestions
              // we need to do this weird stuff because of the weird UX
              // which is to show suggestions under too but add them to bcc!
              // Hopefully we revise it and remove such weirdness
              currentlyUsedQuickSuggestions={bccInputProps.input.value}
              onQuickSuggestionSelected={recipient =>
                bccInputProps.input.onChange([
                  ...(bccInputProps.input.value || []),
                  recipient
                ] as any)
              }
              TextFieldProps={
                {
                  inputProps: {
                    autoFocus: true
                  } as HTMLProps<HTMLInputElement>
                } as TextFieldProps
              }
            />
          )}
        />
        {isCcShown && (
          <Field
            label="Cc"
            name="cc"
            component={EmailRecipientsChipsInput as any}
          />
        )}
        {isBccShown && (
          <Field
            label="Bcc"
            name="bcc"
            component={EmailRecipientsChipsInput as any}
          />
        )}
      </>
    )
  }
  const renderCollapsedFields = (values: EmailFormValues) => (
    <CollapsedRecipients
      to={values.to || []}
      cc={values.cc || []}
      bcc={values.bcc || []}
    />
  )

  return (
    <EmailComposeDrawer
      {...otherProps}
      hasSignatureByDefault
      sendEmail={handleSendEmail}
      title={emailId ? 'Edit email' : 'New Email'}
      getSendEmailResultMessages={form =>
        getSendEmailResultMessages(!!form.due_at)
      }
      renderCollapsedFields={renderCollapsedFields}
      renderFields={renderFields}
    />
  )
}
