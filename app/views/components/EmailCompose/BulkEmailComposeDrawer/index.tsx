import React, { ComponentProps, HTMLProps } from 'react'

import { Field } from 'react-final-form'
import styled from 'styled-components'

import { TextFieldProps } from '@material-ui/core/TextField'

import Tooltip from 'components/tooltip'

import EmailComposeDrawer from 'components/EmailCompose/EmailComposeDrawer'
import { getSendEmailResultMessages } from 'components/EmailCompose/helpers/email-result-messages'

import { createBulkEmailCampaign } from 'models/email/create-bulk-email-campaign'
import IconLock from 'components/SvgIcons/Lock/IconLock'

import ContactsChipsInput from 'components/ContactsChipsInput'

import { updateEmailCampaign } from 'models/email/update-email-campaign'

import { normalizeRecipients } from '../helpers/normalize-recepients'
import { From } from '../fields/From'
import { EmailFormValues } from '../types'
import { CollapsedRecipients } from '../components/CollapsedRecipients'

const LockIcon = styled(IconLock)`
  vertical-align: text-bottom;
  margin: 0 0.5rem;
`

interface Props
  extends Omit<
    ComponentProps<typeof EmailComposeDrawer>,
    | 'sendEmail'
    | 'getSendEmailResultMessages'
    | 'renderFields'
    | 'renderCollapsedFields'
    | 'hasTemplateVariables'
  > {
  getEmail?: (
    values: IIndividualEmailCampaignInput
  ) => IIndividualEmailCampaignInput
  emailId?: string
  disableAddNewRecipient?: boolean
}

export function BulkEmailComposeDrawer({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  ...otherProps
}: Props) {
  const sendEmail = (formValue: EmailFormValues) => {
    const emailData = getEmail({
      from: (formValue.from && formValue.from.id) || '',
      to: normalizeRecipients(formValue.to || []),
      subject: (formValue.subject || '').trim(),
      html: formValue.body || '',
      attachments: (formValue.attachments || []).map(item => item.file_id),
      due_at: formValue.due_at
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createBulkEmailCampaign(emailData)
  }

  const label = (
    <span style={{ whiteSpace: 'nowrap' }}>
      Recipients
      <Tooltip caption="Emails will be sent individually">
        <LockIcon />
      </Tooltip>
    </span>
  )
  const renderFields = () => (
    <>
      <Field component={From} name="from" />

      <Field
        label={label}
        readOnly={disableAddNewRecipient}
        name="to"
        component={ContactsChipsInput as any}
        TextFieldProps={
          {
            inputProps: {
              autoFocus: true
            } as HTMLProps<HTMLInputElement>
          } as TextFieldProps
        }
      />
    </>
  )
  const renderCollapsedFields = (values: EmailFormValues) => (
    <CollapsedRecipients recipients={values.to || []} label={label} />
  )

  return (
    <EmailComposeDrawer
      {...otherProps}
      sendEmail={sendEmail}
      getSendEmailResultMessages={form =>
        getSendEmailResultMessages(!!form.due_at)
      }
      title={emailId ? 'Edit email' : 'New Email'}
      hasTemplateVariables
      renderCollapsedFields={renderCollapsedFields}
      renderFields={renderFields}
    />
  )
}
