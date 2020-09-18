import React, { ComponentProps, HTMLProps } from 'react'
import { Field } from 'react-final-form'
import { TextFieldProps } from '@material-ui/core'
import { useSelector } from 'react-redux'

import { IAppState } from 'reducers'
import { getBrandUsers, getActiveBrand } from 'utils/user-teams'
import { updateEmailCampaign } from 'models/email/update-email-campaign'
import { createEmailCampaign } from 'models/email/create-email-campaign'

import { EmailFormValues } from './types'
import { normalizeRecipients } from './helpers/normalize-recepients'
import { getFromData } from './helpers/get-from-data'
import { From } from './components/From'
import IndividualModeRecipientLabel from './components/IndividualModeRecipientLabel'
import EmailRecipientsChipsInput from '../EmailRecipientsChipsInput'
import EmailComposeForm from './EmailComposeForm'
import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import { useGetAllOauthAccounts } from './helpers/use-get-all-oauth-accounts'
import { getInitialValues } from './helpers/get-initial-values'
import { hasAccountSendPermission } from './helpers/has-account-send-permission'
import { attachmentFormValueToEmailAttachmentInput } from './helpers/attachment-form-value-to-email-attachment-input'
import { EmailRecipientQuickSuggestions } from '../EmailRecipientQuickSuggestions'

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
}

export function BulkEmailComposeForm({
  getEmail = email => email,
  disableAddNewRecipient = false,
  emailId,
  deal,
  preferredAccountId,
  filterAccounts = hasAccountSendPermission,
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
      notifications_enabled: formValue.notifications_enabled
    })

    return emailId
      ? updateEmailCampaign(emailId, emailData)
      : createEmailCampaign(emailData, true)
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
