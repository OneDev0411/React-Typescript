import React, { ComponentProps, useCallback, useState } from 'react'
import { OnChange } from 'react-final-form-listeners'
import { Field } from 'react-final-form'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { createEmailCampaign } from 'models/email/create-email-campaign'
import { updateEmailCampaign } from 'models/email/update-email-campaign'
import { getBrandUsers, getActiveBrand } from 'utils/user-teams'

import { useGetAllOauthAccounts } from './helpers/use-get-all-oauth-accounts'
import { getFromData } from './helpers/get-from-data'
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
  onClose = () => {},
  ...otherProps
}: Props) {
  const user = useSelector<IAppState, IUser>(store => store.user)
  const activeBrand = getActiveBrand(user)
  const activeBrandUsers = activeBrand ? getBrandUsers(activeBrand) : [user]

  const [allAccounts, isLoadingAccounts] = useGetAllOauthAccounts(
    filterAccounts
  )

  const initialValues: Partial<EmailFormValues> = getInitialValues({
    allAccounts,
    defaultValues: otherProps.initialValues,
    defaultUser: user,
    preferredAccountId
  })

  const handleSendEmail = async (
    formValue: EmailFormValues & { template: string }
  ) => {
    const emailData = getEmail({
      ...getFromData(formValue.from, user.id),
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
        onClose={onClose}
        renderCollapsedFields={(values: EmailFormValues) => (
          <>
            {/*
            This is kind of a hack for a behavior in react-final-form.
            When `initialValues` are changed, it updates `values` but only
            those fields that have a corresponding field rendered at that
            moment. `to`, `cc` and `bcc` may
            be updated in initialValues while top fields are collapsed and
            therefore, the changes are never reflected to `values` in this case.
            we render two dummy fields to prevent this issue.
            */}
            <Field name="cc" render={() => null} />
            <Field name="to" render={() => null} />
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
              users={activeBrandUsers}
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
