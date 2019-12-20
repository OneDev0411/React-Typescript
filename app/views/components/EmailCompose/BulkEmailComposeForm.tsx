import { Field } from 'react-final-form'

import React, { ComponentProps, HTMLProps } from 'react'

import { TextFieldProps } from '@material-ui/core/TextField'

import styled from 'styled-components'

import { Tooltip } from '@material-ui/core'

import { updateEmailCampaign } from 'models/email/update-email-campaign'

import { createBulkEmailCampaign } from 'models/email/create-bulk-email-campaign'

import { EmailFormValues } from './types'
import { normalizeRecipients } from './helpers/normalize-recepients'

import { From } from './components/From'
import EmailRecipientsChipsInput from '../EmailRecipientsChipsInput'

import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import IconLock from '../SvgIcons/Lock/IconLock'
import EmailComposeForm from './EmailComposeForm'
import { attachmentFormValueToEmailAttachmentInput } from './helpers/attachment-form-value-to-email-attachment-input'

const LockIcon = styled(IconLock)`
  vertical-align: text-bottom;
  margin: 0 0.5rem;
`

interface Props
  extends Omit<
    ComponentProps<typeof EmailComposeForm>,
    | 'sendEmail'
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

export function BulkEmailComposeForm({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  ...otherProps
}: Props) {
  const sendEmail = (formValue: EmailFormValues & { template: string }) => {
    const emailData: IIndividualEmailCampaignInput = getEmail({
      from: (formValue.from && formValue.from.id) || '',
      to: normalizeRecipients(formValue.to || []),
      subject: (formValue.subject || '').trim(),
      html: formValue.body || '',
      template: formValue.template,
      attachments: (formValue.attachments || []).map(
        attachmentFormValueToEmailAttachmentInput
      ),
      due_at: formValue.due_at || new Date()
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createBulkEmailCampaign(emailData)
  }

  const label = (
    <span style={{ whiteSpace: 'nowrap' }}>
      Recipients
      <Tooltip title="Emails will be sent individually">
        <LockIcon />
      </Tooltip>
    </span>
  )
  const renderFields = () => (
    <>
      <Field
        render={({ input }) => <From user={input.value as IUser} />}
        name="from"
      />

      <Field
        label={label}
        readOnly={disableAddNewRecipient}
        name="to"
        component={EmailRecipientsChipsInput as any}
        includeQuickSuggestions
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
    <CollapsedEmailRecipients to={values.to || []} />
  )

  return (
    <EmailComposeForm
      {...otherProps}
      sendEmail={sendEmail}
      hasTemplateVariables
      renderCollapsedFields={renderCollapsedFields}
      renderFields={renderFields}
    />
  )
}
