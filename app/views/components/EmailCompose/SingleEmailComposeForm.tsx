import React, { ComponentProps, useCallback, useState } from 'react'
import { OnChange } from 'react-final-form-listeners'
import { Field } from 'react-final-form'

import { createEmailCampaign } from 'models/email/create-email-campaign'
import { updateEmailCampaign } from 'models/email/update-email-campaign'

import { useGetAllOauthAccounts } from './helpers/use-get-all-oauth-accounts'
import { normalizeRecipients } from './helpers/normalize-recepients'
import { getInitialValues } from './helpers/get-initial-values'
import { hasAccountSendPermission } from './helpers/has-account-send-permission'
import { EmailFormValues } from './types'
import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import EmailComposeForm from './EmailComposeForm'
import { EmailRecipientsFields } from './fields/EmailRecipientsFields'
import { attachmentFormValueToEmailAttachmentInput } from './helpers/attachment-form-value-to-email-attachment-input'
import { TemplateExpressionContext } from '../TextEditor/features/TemplateExpressions/template-expressions-plugin/template-expression-context'

interface Props
  extends Omit<
    ComponentProps<typeof EmailComposeForm>,
    'sendEmail' | 'renderCollapsedFields' | 'renderFields'
  > {
  filterAccounts?: (account: IOAuthAccount) => boolean
  /**
   * if there is not initial value for google_credential or microsoft_credential
   * and user has connected accounts, this can be used for determining
   * initial value of the account by which the email will be sent
   */
  preferredAccountId?: UUID
  getEmail?: (values: IEmailCampaignInput) => IEmailCampaignInput
  headers?:
    | IEmailCampaignInput['headers']
    | ((formValues: EmailFormValues) => IEmailCampaignInput['headers'])
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
  filterAccounts = hasAccountSendPermission,
  preferredAccountId,
  deal,
  headers = {},
  ...otherProps
}: Props) {
  const [allAccounts, isLoadingAccounts] = useGetAllOauthAccounts(
    filterAccounts
  )

  const initialValues: Partial<EmailFormValues> = getInitialValues(
    allAccounts,
    preferredAccountId,
    otherProps.initialValues
  )

  const handleSendEmail = async (
    formValue: EmailFormValues & { template: string }
  ) => {
    const emailData = getEmail({
      from: (formValue.from && formValue.from.id) || '',
      microsoft_credential: formValue.microsoft_credential,
      google_credential: formValue.google_credential,
      to: normalizeRecipients(formValue.to),
      cc: normalizeRecipients(formValue.cc),
      bcc: normalizeRecipients(formValue.bcc),
      subject: (formValue.subject || '').trim(),
      template: formValue.template,
      headers: typeof headers === 'function' ? headers(formValue) : headers,
      html: formValue.body || '',
      attachments: (formValue.attachments || []).map(
        attachmentFormValueToEmailAttachmentInput
      ),
      due_at: formValue.due_at || new Date()
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createEmailCampaign(emailData)
  }

  const getExpressionsContext = useCallback(
    (to: IDenormalizedEmailRecipientInput[] | undefined) => {
      const firstRecipient = (to || [])[0]

      if (firstRecipient && firstRecipient.recipient_type === 'Email') {
        return {
          recipient: firstRecipient.contact || {
            email: firstRecipient.email
          }
        }
      }

      return firstRecipient ? { recipient: {} } : null
    },
    []
  )

  const [expressionContext, setExpressionContext] = useState<object | null>(
    getExpressionsContext(initialValues && initialValues.to)
  )

  const updateExpressionContext = (
    to: IDenormalizedEmailRecipientInput[] | undefined
  ) => setExpressionContext(getExpressionsContext(to))

  return (
    // NOTE: if we decided to show the result of the `sender` expressions
    // to we can move this context provider into the EmailComposeForm and
    // add the recipient context by a prop to it.
    <TemplateExpressionContext.Provider value={expressionContext}>
      <EmailComposeForm
        hasSignatureByDefault
        {...otherProps}
        initialValues={initialValues}
        deal={deal}
        isSubmitDisabled={isLoadingAccounts}
        sendEmail={handleSendEmail}
        renderCollapsedFields={(values: EmailFormValues) => (
          <>
            {/*
            This is kind of a hack for a behavior in react-final-form.
            When `initialValues` are changed, it updates `values` but only
            those fields that have a corresponding field rendered at that
            moment. `to`, `cc`, `google_credential` and `microsoft_credential` may
            be updated in initialValues while top fields are collapsed and
            therefore, the changes are never reflected to `values` in this case.
            we render two dummy fields to prevent this issue.
            */}
            <Field name="cc" render={() => null} />
            <Field name="to" render={() => null} />
            <Field name="google_credential" render={() => null} />
            <Field name="microsoft_credential" render={() => null} />
            <OnChange name="to">{updateExpressionContext}</OnChange>

            <CollapsedEmailRecipients
              to={values.to || []}
              cc={values.cc || []}
              bcc={values.bcc || []}
            />
          </>
        )}
        renderFields={values => (
          <>
            <EmailRecipientsFields
              deal={deal}
              senderAccounts={allAccounts}
              disableAddNewRecipient={disableAddNewRecipient}
              values={values}
            />
            <OnChange name="to">{updateExpressionContext}</OnChange>
          </>
        )}
      />
    </TemplateExpressionContext.Provider>
  )
}
