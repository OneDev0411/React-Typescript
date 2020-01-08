import { OAuthProvider } from 'constants/contacts'

import React, { ComponentProps, useCallback, useMemo, useState } from 'react'
import useEffectOnce from 'react-use/lib/useEffectOnce'
import { useDispatch, useSelector } from 'react-redux'
import { OnChange } from 'react-final-form-listeners'
import { Field } from 'react-final-form'

import { createEmailCampaign } from 'models/email/create-email-campaign'
import { updateEmailCampaign } from 'models/email/update-email-campaign'
import { fetchOAuthAccounts } from 'actions/contacts/fetch-o-auth-accounts'
import { IAppState } from 'reducers'
import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { normalizeRecipients } from './helpers/normalize-recepients'
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
  const oAuthAccounts = useSelector(
    (state: IAppState) => state.contacts.oAuthAccounts
  )

  const dispatch = useDispatch()
  const allAccounts = selectAllConnectedAccounts(oAuthAccounts).filter(
    filterAccounts
  )

  useEffectOnce(() => {
    Object.entries(oAuthAccounts.loading).forEach(
      ([provider, loading]: [OAuthProvider, boolean | null]) => {
        if (loading === null) {
          fetchOAuthAccounts(provider)(dispatch)
        }
      }
    )
  })

  // If no account is selected and there are more than one account, we set
  // one account by default to push user use one of their accounts for
  // sending emails instead of using out default solution (Mailgun) for
  // sending emails.
  const initialValues: Partial<EmailFormValues> = useMemo(
    () =>
      allAccounts.length > 0 &&
      (!otherProps.initialValues ||
        !hasSelectedAccount(otherProps.initialValues))
        ? {
            ...otherProps.initialValues,
            ...getDefaultSelectedAccount(allAccounts, preferredAccountId)
          }
        : otherProps.initialValues || {},
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allAccounts.length, otherProps.initialValues, preferredAccountId]
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

  // We disable submit until connected accounts are fetched, to make sure
  // emails are sent with connected accounts in this case
  const isLoadingAccounts = Object.values(oAuthAccounts.loading).some(
    i => i !== false
  )

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

function hasSelectedAccount(values: Partial<EmailFormValues>): boolean {
  return Boolean(values.microsoft_credential || values.google_credential)
}

function getDefaultSelectedAccount(
  allAccounts: (IOAuthAccount)[],
  preferredAccountId: string | undefined
): Pick<EmailFormValues, 'microsoft_credential' | 'google_credential'> {
  const account =
    allAccounts.find(
      account => !preferredAccountId || account.id === preferredAccountId
    ) || allAccounts[0]

  return account
    ? {
        microsoft_credential:
          account.type === 'microsoft_credential' ? account.id : undefined,
        google_credential:
          account.type === 'google_credential' ? account.id : undefined
      }
    : {}
}
