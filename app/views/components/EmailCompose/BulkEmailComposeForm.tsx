import { useMemo, ComponentProps, HTMLProps } from 'react'

import { TextFieldProps } from '@material-ui/core'
import { Field } from 'react-final-form'
import { useSelector } from 'react-redux'

import { useUnsafeActiveBrand } from '@app/hooks/brand/use-unsafe-active-brand'
import { useImpersonateUser } from '@app/hooks/use-impersonate-user'
import { createEmailCampaign } from 'models/email/create-email-campaign'
import { updateEmailCampaign } from 'models/email/update-email-campaign'
import { selectUser } from 'selectors/user'
import { getBrandUsers } from 'utils/user-teams'

import { EmailRecipientQuickSuggestions } from '../EmailRecipientQuickSuggestions'
import EmailRecipientsChipsInput from '../EmailRecipientsChipsInput'

import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import { From } from './components/From'
import IndividualModeRecipientLabel from './components/IndividualModeRecipientLabel'
import EmailComposeForm from './EmailComposeForm'
import { attachmentFormValueToEmailAttachmentInput } from './helpers/attachment-form-value-to-email-attachment-input'
import { getFromData } from './helpers/get-from-data'
import { getInitialValues } from './helpers/get-initial-values'
import { hasAccountSendPermission } from './helpers/has-account-send-permission'
import { normalizeRecipients } from './helpers/normalize-recepients'
import { useGetAllOauthAccounts } from './helpers/use-get-all-oauth-accounts'
import { EmailFormValues } from './types'

interface Props
  extends Omit<
    ComponentProps<typeof EmailComposeForm>,
    | 'sendEmail'
    | 'renderFields'
    | 'renderCollapsedFields'
    | 'hasTemplateVariables'
  > {
  filterAccounts?: (account: IOAuthAccount) => boolean
  /**
   * if there is not initial value for google_credential or microsoft_credential
   * and user has connected accounts, this can be used for determining
   * initial value of the account by which the email will be sent
   */
  preferredAccountId?: UUID
  getEmail?: (
    values: IIndividualEmailCampaignInput
  ) => IIndividualEmailCampaignInput
  emailId?: string
  disableAddNewRecipient?: boolean
  tags?: string[]
}

export function BulkEmailComposeForm({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  deal,
  preferredAccountId,
  filterAccounts = hasAccountSendPermission,
  tags,
  ...otherProps
}: Props) {
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

  const sendEmail = (formValue: EmailFormValues & { template: string }) => {
    const emailData: IIndividualEmailCampaignInput = getEmail({
      ...getFromData(formValue.from, user.id),
      to: normalizeRecipients(formValue.to || []),
      subject: (formValue.subject || '').trim(),
      html: formValue.body || '',
      template: formValue.template,
      attachments: (formValue.attachments || []).map(
        attachmentFormValueToEmailAttachmentInput
      ),
      due_at: formValue.due_at || new Date(),
      notifications_enabled: formValue.notifications_enabled,
      individual: true,
      tags
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createEmailCampaign(emailData)
  }

  const renderFields = () => (
    <>
      <From users={activeBrandUsers} accounts={allAccounts} />
      <Field
        label={<IndividualModeRecipientLabel />}
        name="to"
        render={toFieldProps => (
          <>
            <EmailRecipientsChipsInput
              {...toFieldProps}
              readOnly={disableAddNewRecipient}
              TextFieldProps={
                {
                  inputProps: {
                    autoFocus: true
                  } as HTMLProps<HTMLInputElement>
                } as TextFieldProps
              }
            />
            <EmailRecipientQuickSuggestions
              deal={deal}
              currentRecipients={[...(toFieldProps.input.value || [])]}
              onSelect={recipient => {
                toFieldProps.input.onChange([
                  ...(toFieldProps.input.value || []),
                  recipient
                ] as any)
              }}
            />
          </>
        )}
      />
    </>
  )

  const renderCollapsedFields = (values: EmailFormValues) => (
    <>
      {/*
      This is kind of a hack for a behavior in react-final-form.
      When `initialValues` are changed, it updates `values` but only
      those fields that have a corresponding field rendered at that
      moment. `to`, `cc` and bcc may be updated in initialValues while top 
      fields are collapsed and therefore, the changes are never reflected to 
      `values` in this case. we render two dummy fields to prevent this issue.
      */}
      <Field name="to" render={() => null} />
      <CollapsedEmailRecipients to={values.to || []} />
    </>
  )

  return (
    <EmailComposeForm
      {...otherProps}
      hasTemplateVariables
      sendEmail={sendEmail}
      renderFields={renderFields}
      initialValues={initialValues}
      isSubmitDisabled={isLoadingAccounts}
      renderCollapsedFields={renderCollapsedFields}
    />
  )
}
