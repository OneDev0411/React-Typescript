import React, { ComponentProps, useState, useMemo } from 'react'
import { Field, useField } from 'react-final-form'
import { useSelector, useDispatch } from 'react-redux'

import { IAppState } from 'reducers'
import { updateEmailCampaign } from 'models/email/update-email-campaign'
import { createEmailCampaign } from 'models/email/create-email-campaign'
import { getBrandUsers, getActiveBrand } from 'utils/user-teams'
import { toEntityAssociation } from 'utils/association-utils'

import { confirmation } from 'actions/confirmation'

import { useGetAllOauthAccounts } from './helpers/use-get-all-oauth-accounts'
import { getFromData } from './helpers/get-from-data'
import { normalizeRecipients } from './helpers/normalize-recepients'
import { getInitialValues } from './helpers/get-initial-values'
import { hasAccountSendPermission } from './helpers/has-account-send-permission'
import { EmailFormValues, EmailComposeFormProps } from './types'
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
  onClickAddDealAttachments?: () => void
}

export function SingleEmailComposeForm({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  filterAccounts = hasAccountSendPermission,
  preferredAccountId,
  deal,
  headers = {},
  onClickAddDealAttachments = () => {},
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

  const dispach = useDispatch()

  const [individualMode, setIndividualMode] = useState(false)

  const handleSendEmail = async (
    formValue: EmailFormValues & { template: string }
  ) => {
    const emailData = getEmail({
      ...getFromData(formValue.from, user.id),
      to: normalizeRecipients(formValue.to),
      cc: individualMode ? undefined : normalizeRecipients(formValue.cc),
      bcc: individualMode ? undefined : normalizeRecipients(formValue.bcc),
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
      : createEmailCampaign(
          emailData,
          {
            'associations[]': [
              'email_campaign_recipient.contact',
              'email_campaign_email.email',
              ...['emails', 'template', 'from', 'recipients'].map(
                toEntityAssociation('email_campaign')
              )
            ]
          },
          individualMode
        )
  }

  const handleSelectMarketingTemplate: EmailComposeFormProps['onSelectMarketingTemplate'] = (
    template,
    values
  ) => {
    if (!template) {
      setIndividualMode(false)

      return true
    }

    const ccBcc = [...(values.cc || []), ...(values.bcc || [])]

    if (ccBcc.length === 0) {
      setIndividualMode(true)

      return true
    }

    return new Promise(resolve =>
      dispach(
        confirmation({
          message: 'You have recipients in the Cc and Bcc fields',
          description:
            'Marketing templates will only be sent individually. Are you willing to send it directly to all of them?',
          confirmLabel: 'Yes',
          cancelLabel: 'Cancel',
          onConfirm: () => {
            values.to = [...(values.to || []), ...ccBcc]
            delete values.cc
            delete values.bcc
            setIndividualMode(true)
            resolve(true)
          },
          onCancel: () => resolve(false)
        })
      )
    )
  }

  const toField = useField<IDenormalizedEmailRecipientInput[] | undefined>('to')
  const toFieldValue = toField?.input.value
  const initialToFieldValue = initialValues?.to
  const expressionContext = useMemo(() => {
    const to = toFieldValue || initialToFieldValue
    const firstRecipient = (to || [])[0]

    if (firstRecipient && firstRecipient.recipient_type === 'Email') {
      return {
        recipient: firstRecipient.contact || {
          email: firstRecipient.email
        }
      }
    }

    return firstRecipient ? { recipient: {} } : null
  }, [toFieldValue, initialToFieldValue])

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
        onClickAddDealAttachments={onClickAddDealAttachments}
        onSelectMarketingTemplate={handleSelectMarketingTemplate}
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
              values={values}
              disableAddNewRecipient={disableAddNewRecipient}
              individualMode={individualMode}
              deal={deal}
              senderAccounts={allAccounts}
              users={activeBrandUsers}
            />
          </>
        )}
      />
    </TemplateExpressionContext.Provider>
  )
}
