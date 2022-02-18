import { ComponentProps, useState, useMemo } from 'react'

import { Field } from 'react-final-form'
import { useSelector, useDispatch } from 'react-redux'

import { DealRolesProvider } from '@app/contexts/deals-roles-definitions/provider'
import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { useImpersonateUser } from '@app/hooks/use-impersonate-user'
import { confirmation } from 'actions/confirmation'
import { createEmailCampaign } from 'models/email/create-email-campaign'
import { updateEmailCampaign } from 'models/email/update-email-campaign'
import { selectUser } from 'selectors/user'
import { getBrandUsers } from 'utils/user-teams'

import { TemplateExpressionContext } from '../TextEditor/features/TemplateExpressions/template-expressions-plugin/template-expression-context'

import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import EmailComposeForm from './EmailComposeForm'
import { EmailRecipientsFields } from './fields/EmailRecipientsFields'
import { attachmentFormValueToEmailAttachmentInput } from './helpers/attachment-form-value-to-email-attachment-input'
import { getFromData } from './helpers/get-from-data'
import { getInitialValues } from './helpers/get-initial-values'
import { hasAccountSendPermission } from './helpers/has-account-send-permission'
import { normalizeRecipients } from './helpers/normalize-recepients'
import { useGetAllOauthAccounts } from './helpers/use-get-all-oauth-accounts'
import { EmailFormValues, EmailComposeFormProps } from './types'

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
  const dispach = useDispatch()
  const user = useSelector(selectUser)
  const activeBrand = useUnsafeActiveBrand()
  const impersonateUser = useImpersonateUser()
  const activeBrandUsers = useMemo(() => {
    const users = activeBrand ? getBrandUsers(activeBrand) : [user]

    if (
      impersonateUser &&
      !users.some(user => user.id === impersonateUser.id)
    ) {
      users.push(impersonateUser)
    }

    return users
  }, [activeBrand, impersonateUser, user])
  const [allAccounts, isLoadingAccounts] =
    useGetAllOauthAccounts(filterAccounts)

  const initialValues: Partial<EmailFormValues> = getInitialValues({
    allAccounts,
    defaultUser: impersonateUser ?? user,
    impersonateUser,
    defaultValues: otherProps.initialValues,
    preferredAccountId
  })

  const [individualMode, setIndividualMode] = useState(
    !!otherProps.initialValues?.templateInstance
  )

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
      due_at: formValue.due_at || new Date(),
      notifications_enabled: formValue.notifications_enabled,
      individual: individualMode
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createEmailCampaign(emailData)
  }

  // eslint-disable-next-line max-len
  const handleSelectMarketingTemplate: EmailComposeFormProps['onSelectMarketingTemplate'] =
    (template, values) => {
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
              // eslint-disable-next-line max-len
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

  const initialToFieldValue = initialValues?.to
  const [toFieldValue, setToFieldValue] = useState(initialToFieldValue)
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
  }, [initialToFieldValue, toFieldValue])

  return (
    // NOTE: if we decided to show the result of the `sender` expressions
    // to we can move this context provider into the EmailComposeForm and
    // add the recipient context by a prop to it.
    <TemplateExpressionContext.Provider value={expressionContext}>
      <DealRolesProvider>
        <EmailComposeForm
          hasSignatureByDefault
          {...otherProps}
          initialValues={initialValues}
          deal={deal}
          isSubmitDisabled={isLoadingAccounts}
          sendEmail={handleSendEmail}
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
                onToFieldChange={setToFieldValue}
                users={activeBrandUsers}
              />
            </>
          )}
        />
      </DealRolesProvider>
    </TemplateExpressionContext.Provider>
  )
}
