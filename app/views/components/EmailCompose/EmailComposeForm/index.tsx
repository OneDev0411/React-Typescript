import { Field, Form } from 'react-final-form'
import React, {
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import arrayMutators from 'final-form-arrays'
import createFocusDecorator from 'final-form-focus'
import { Link as RouterLink } from 'react-router'

import { flow, isEqual } from 'lodash'

import { TextField } from 'final-form-material-ui'

import { addNotification as notify } from 'reapop'

import { connect, useSelector } from 'react-redux'

import { Box, Link, makeStyles } from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

import { uploadEmailAttachment } from 'models/email/upload-email-attachment'

import { IAppState } from 'reducers/index'

import { selectAllConnectedAccounts } from 'reducers/contacts/oAuthAccounts'

import { EmailComposeFormProps, EmailFormValues } from '../types'
import EmailBody from '../components/EmailBody'
import { AttachmentsList } from '../fields/Attachments'
import { styles } from './styles'
import { Footer } from '../components/Footer'
import ConfirmationModalContext from '../../ConfirmationModal/context'
import { validateRecipient } from '../../EmailRecipientsChipsInput/helpers/validate-recipient'
import { getSendEmailResultMessages } from '../helpers/email-result-messages'
import { TextEditorRef } from '../../TextEditor/types'
import { Callout } from '../../Callout'
import { DangerButton } from '../../Button/DangerButton'
import getTemplateInstancePreviewImage from '../../InstantMarketing/helpers/get-template-preview-image'
import { isFileAttachment } from '../helpers/is-file-attachment'

export const useEmailFormStyles = makeStyles(styles, { name: 'EmailForm' })

/**
 * Shared parts of the different email compose forms.
 * Currently there are two types of email compose:
 *  - Batch ({@link BulkEmailComposeDrawer})
 *  - Single ({@link SingleEmailComposeDrawer})
 * Difference between these types are:
 * - Different way of sending email (different endpoint and DTOs)
 * - Some UI differences in the input form.
 *
 * These differences are abstracted away from EmailComposeForm
 * as props to be provided by concrete email compose drawer components.
 *
 * UPDATE: We first decided to create separate components for bulk and single
 * email compose. But the way they evolved now can question this and we may
 * need to refactor these BulkXXX, SingleXXX components into a single component
 * Right now there are some duplicate code in them, and the added abstraction
 * is not necessarily worth it.
 */
function EmailComposeForm<T>({
  isSubmitDisabled = false,
  initialValues = {
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
    attachments: []
  },
  dispatch,
  evaluateTemplateExpressions = false,
  onCancel,
  onDelete,
  uploadAttachment = uploadEmailAttachment,
  onSent = () => {},
  children,
  ...props
}: EmailComposeFormProps<T> & ClassesProps<typeof styles>) {
  const hasRecipients =
    (initialValues.to || []).length > 0 && !!initialValues.from
  const hasSubject = !!initialValues.subject
  const autofocusBody = hasRecipients && hasSubject

  const [topFieldsCollapsed, setTopFieldsCollapsed] = useState<boolean>(
    hasRecipients
  )
  const emailBodyEditorRef = useRef<TextEditorRef>(null)
  const [
    marketingTemplate,
    setMarketingTemplate
  ] = useState<IMarketingTemplateInstance | null>(null)

  const marketingTemplatePreviewHtml = useMemo(
    () =>
      marketingTemplate
        ? getTemplateInstancePreviewImage(marketingTemplate)
        : undefined,
    [marketingTemplate]
  )
  const confirmationModal = useContext(ConfirmationModalContext)

  const classes = useEmailFormStyles(props)

  const handleSendEmail = async (formData: EmailFormValues) => {
    const { successMessage, errorMessage } = getSendEmailResultMessages(
      !!formData.due_at
    )

    let result: T

    try {
      result = await props.sendEmail(
        marketingTemplate
          ? {
              ...formData,
              body: marketingTemplate.html,
              template: marketingTemplate.id
            }
          : formData
      )
    } catch (e) {
      console.error('error in sending email', e)

      return dispatch(
        notify({
          status: 'error',
          message:
            (e.response && e.response.body && e.response.body.message) ||
            errorMessage
        })
      )
    }

    dispatch(
      notify({
        status: 'success',
        message: successMessage
      })
    )

    onSent(result)
  }

  const onSubmit = form => {
    const uploadingAttachment = (form.uploadingAttachments || []).length > 0
    const uploadingImage =
      emailBodyEditorRef.current &&
      emailBodyEditorRef.current.hasUploadingImage()

    if (uploadingImage || uploadingAttachment) {
      return new Promise((resolve, reject) => {
        confirmationModal.setConfirmationModal({
          message: 'Upload in progress',
          description: `Please wait while ${
            uploadingImage ? 'images' : 'attachments'
          } are uploading, or remove them`,
          cancelLabel: 'Ok',
          needsConfirm: false,
          onCancel: reject
        })
      })
    }

    if ((form.uploadingAttachments || []).length > 0) {
      return new Promise((resolve, reject) => {
        confirmationModal.setConfirmationModal({
          message: 'Upload in progress',
          description:
            'Please wait while attachments are uploading, or remove them',
          cancelLabel: 'Ok',
          needsConfirm: false,
          onCancel: reject
        })
      })
    }

    if ((form.subject || '').trim() === '') {
      return new Promise((resolve, reject) => {
        confirmationModal.setConfirmationModal({
          message: 'Send without subject?',
          description:
            'This email has no subject. Are you sure you want to send it?',
          confirmLabel: 'Send anyway',
          onCancel: reject,
          onConfirm: () => {
            handleSendEmail(form)
              .then(resolve)
              .catch(reject)
          }
        })
      })
    }

    return handleSendEmail(form)
  }

  const allConnectedAccounts = useSelector(
    flow(
      (state: IAppState) => state.contacts.oAuthAccounts,
      selectAllConnectedAccounts
    )
  )

  const validate = useCallback(
    (values: EmailFormValues) => {
      const errors: { [key in keyof EmailFormValues]?: string | ReactNode } = {}
      const { to } = values

      if (!to || to.length === 0) {
        errors.to = 'You should provide at least one recipient'
      } else {
        const recipientErrors = to.map(validateRecipient).filter(i => i)

        if (recipientErrors.length > 0) {
          errors.to = recipientErrors[0]
        }
      }

      const invalidAccountMsg = (type: string) => (
        <>
          Selected {type} account is removed or no longer connected.{' '}
          <Link
            component={RouterLink}
            target="_blank"
            to="/dashboard/account/connected-accounts"
          >
            Connected Accounts
          </Link>
          .
        </>
      )

      const accountExists = (accountId: string) =>
        allConnectedAccounts.some(account => account.id === accountId)

      if (
        values.microsoft_credential &&
        !accountExists(values.microsoft_credential)
      ) {
        errors.microsoft_credential = invalidAccountMsg('Outlook')
      }

      if (
        values.google_credential &&
        !accountExists(values.google_credential)
      ) {
        errors.google_credential = invalidAccountMsg('Google')
      }

      return errors
    },
    [allConnectedAccounts]
  )

  const scrollToEnd = () => {
    if (emailBodyEditorRef.current) {
      emailBodyEditorRef.current.scrollToEnd()
    }
  }

  const decorators = useMemo(() => {
    return [
      // we use this decorator to expand to if form is submitted
      // while it has error
      createFocusDecorator(() => {
        const expandTolFields = () => {
          setTopFieldsCollapsed(false)
        }

        return [
          {
            name: 'to',
            focus: expandTolFields
          },
          {
            name: 'microsoft_credential',
            focus: expandTolFields
          },
          {
            name: 'google_credential',
            focus: expandTolFields
          }
        ]
      })
    ]
  }, [])

  return (
    <Form
      validate={validate}
      onSubmit={onSubmit}
      decorators={decorators}
      mutators={{ ...arrayMutators }}
      initialValues={initialValues}
      initialValuesEqual={isEqual}
      keepDirtyOnReinitialize
      render={formProps => {
        const { submitting } = formProps
        const values = formProps.values as EmailFormValues

        return (
          <form
            className={classes.root}
            id="email-compose-form"
            onSubmit={formProps.handleSubmit}
          >
            <div className={classes.container}>
              <div className={classes.topFields}>
                {topFieldsCollapsed ? (
                  <div onClick={() => setTopFieldsCollapsed(false)}>
                    {props.renderCollapsedFields(values)}
                  </div>
                ) : (
                  props.renderFields(values)
                )}
              </div>
              <Field
                placeholder="Subject"
                name="subject"
                InputProps={{
                  onFocus: () => setTopFieldsCollapsed(true),
                  inputProps: {
                    autoFocus: hasRecipients && !hasSubject,
                    'data-test': 'email-subject'
                  }
                }}
                fullWidth
                component={TextField}
              />

              <EmailBody
                editorRef={emailBodyEditorRef}
                DraftEditorProps={{
                  onFocus: () => setTopFieldsCollapsed(true)
                }}
                autofocus={autofocusBody}
                hasSignatureByDefault={props.hasSignatureByDefault}
                hasStaticBody={marketingTemplate || props.hasStaticBody}
                hasTemplateVariables={props.hasTemplateVariables}
                content={
                  marketingTemplate
                    ? marketingTemplatePreviewHtml
                    : initialValues.body || ''
                }
                uploadAttachment={uploadAttachment}
                attachments={
                  <Field name="attachments" component={AttachmentsList} />
                }
              />
              {marketingTemplate && (
                <Callout dense>
                  <Box display="flex" alignItems="center">
                    <Box flex={1}>
                      You are using a Marketing Center Template
                    </Box>
                    <DangerButton
                      onClick={() => {
                        setMarketingTemplate(null)
                      }}
                    >
                      Remove
                    </DangerButton>
                  </Box>
                </Callout>
              )}
            </div>
            {children}

            {/*
            If react-final-form was up to date, we could use useField instead
            of nesting footer inside a Field just to be able to update subject.
            */}
            <Field
              name="subject"
              render={({ input: subjectInput }) => (
                <Footer
                  formProps={{ values: formProps.values as EmailFormValues }}
                  isSubmitting={submitting}
                  isSubmitDisabled={
                    typeof isSubmitDisabled === 'function'
                      ? isSubmitDisabled(values)
                      : isSubmitDisabled
                  }
                  uploadAttachment={uploadAttachment}
                  initialAttachments={(initialValues.attachments || []).filter(
                    isFileAttachment
                  )}
                  deal={props.deal}
                  onCancel={onCancel}
                  onDelete={onDelete}
                  onChanged={scrollToEnd}
                  hasStaticBody={props.hasStaticBody}
                  onEmailTemplateSelected={template => {
                    subjectInput.onChange(template.subject as any)
                    setMarketingTemplate(null)

                    if (emailBodyEditorRef.current) {
                      emailBodyEditorRef.current.update(template.body)
                    }
                  }}
                  onMarketingTemplateSelected={template => {
                    setMarketingTemplate(template)
                  }}
                  className={classes.footer}
                />
              )}
            />
          </form>
        )
      }}
    />
  )
}

export default connect()(EmailComposeForm)
