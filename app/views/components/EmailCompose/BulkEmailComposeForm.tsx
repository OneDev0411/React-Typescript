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
import IconLock from '../SvgIcons/Lock/IconLock'

import EmailComposeForm from './EmailComposeForm'
import { CollapsedEmailRecipients } from './components/CollapsedEmailRecipients'
import { useGetAllOauthAccounts } from './helpers/use-get-all-oauth-accounts'
import { getInitialValues } from './helpers/get-initial-values'
import { hasAccountSendPermission } from './helpers/has-account-send-permission'
import { attachmentFormValueToEmailAttachmentInput } from './helpers/attachment-form-value-to-email-attachment-input'
import { EmailRecipientQuickSuggestions } from '../EmailRecipientQuickSuggestions'

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
  const [allAccounts, isLoadingAccounts] = useGetAllOauthAccounts(
    filterAccounts
  )

  const initialValues: Partial<EmailFormValues> = getInitialValues(
    allAccounts,
    preferredAccountId,
    otherProps.initialValues
  )

  const sendEmail = (formValue: EmailFormValues & { template: string }) => {
    const emailData: IIndividualEmailCampaignInput = getEmail({
      from: (formValue.from && formValue.from.id) || '',
      microsoft_credential: formValue.microsoft_credential,
      google_credential: formValue.google_credential,
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
        render={({ input }) => (
          <From user={input.value as IUser} accounts={allAccounts} />
        )}
        name="from"
      />

      <Field
        label={label}
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
      moment. `to`, `cc`, `google_credential` and `microsoft_credential` may
      be updated in initialValues while top fields are collapsed and
      therefore, the changes are never reflected to `values` in this case.
      we render two dummy fields to prevent this issue.
      */}
      <Field name="to" render={() => null} />
      <Field name="google_credential" render={() => null} />
      <Field name="microsoft_credential" render={() => null} />

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
