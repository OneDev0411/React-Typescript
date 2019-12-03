import React, { ComponentProps } from 'react'

import { createEmailCampaign } from 'models/email/create-email-campaign'

import { updateEmailCampaign } from 'models/email/update-email-campaign'

import { normalizeRecipients } from './helpers/normalize-recepients'
import { EmailFormValues } from './types'
import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import EmailComposeForm from './EmailComposeForm'
import { EmailRecipientsFields } from './fields/EmailRecipientsFields'
import { useExpressionEvaluator } from './EmailComposeForm/use-expression-evaluator'

interface Props
  extends Omit<
    ComponentProps<typeof EmailComposeForm>,
    | 'hasSignatureByDefault'
    | 'sendEmail'
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

export function SingleEmailComposeForm({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  fromOptions,
  deal,
  ...otherProps
}: Props) {
  const { evaluate } = useExpressionEvaluator()

  const handleSendEmail = async (
    formValue: EmailFormValues & { template: string }
  ) => {
    if (!formValue.due_at || formValue.due_at.getTime() <= Date.now()) {
      formValue.body = await evaluate(formValue.body || '', formValue)
    }

    const emailData = getEmail({
      from: (formValue.from && formValue.from.value) || '',
      to: normalizeRecipients(formValue.to),
      cc: normalizeRecipients(formValue.cc),
      bcc: normalizeRecipients(formValue.bcc),
      subject: (formValue.subject || '').trim(),
      template: formValue.template,
      html: formValue.body || '',
      attachments: (formValue.attachments || []).map(item => item.id),
      due_at: formValue.due_at || new Date()
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createEmailCampaign(emailData)
  }

  return (
    <EmailComposeForm
      {...otherProps}
      deal={deal}
      hasSignatureByDefault
      sendEmail={handleSendEmail}
      renderCollapsedFields={(values: EmailFormValues) => (
        <CollapsedEmailRecipients
          to={values.to || []}
          cc={values.cc || []}
          bcc={values.bcc || []}
        />
      )}
      renderFields={values => (
        <EmailRecipientsFields
          deal={deal}
          fromOptions={fromOptions}
          disableAddNewRecipient={disableAddNewRecipient}
          values={values}
        />
      )}
    />
  )
}
