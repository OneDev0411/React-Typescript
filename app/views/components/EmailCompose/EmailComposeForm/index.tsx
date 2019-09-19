import { Field, Form } from 'react-final-form'
import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import arrayMutators from 'final-form-arrays'
import createDecorator from 'final-form-focus'

import { isEqual } from 'lodash'

import { TextField } from 'final-form-material-ui'

import { addNotification as notify } from 'reapop'

import { connect } from 'react-redux'

import { makeStyles } from '@material-ui/core'

import { ClassesProps } from 'utils/ts-utils'

import { EmailComposeFormProps, EmailFormValues } from '../types'
import EmailBody from '../components/EmailBody'
import { AttachmentsList } from '../fields/Attachments'
import { styles } from './styles'
import { Footer } from '../components/Footer'
import ConfirmationModalContext from '../../ConfirmationModal/context'
import { validateRecipient } from '../../EmailRecipientsChipsInput/helpers/validate-recipient'

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
function EmailComposeForm({
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
  onSent = () => {},
  ...props
}: EmailComposeFormProps & ClassesProps<typeof styles>) {
  const [topFieldsCollapsed, setTopFieldsCollapsed] = useState(false)
  const emailBodyEditorRef = useRef<any>(null)
  const confirmationModal = useContext(ConfirmationModalContext)

  const classes = useEmailFormStyles(props)

  const handleSendEmail = useCallback(
    async form => {
      const { successMessage, errorMessage } = props.getSendEmailResultMessages(
        form
      )

      let result: IEmailCampaign

      try {
        result = await props.sendEmail(form)
      } catch (e) {
        console.error('error in sending email', e)

        return dispatch(
          notify({
            status: 'error',
            message: errorMessage
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
    },
    [dispatch, onSent, props]
  )
  const onSubmit = useCallback(
    form => {
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
    },
    [confirmationModal, handleSendEmail]
  )
  const validate = useCallback(values => {
    const errors: { [key in keyof EmailFormValues]?: string } = {}
    const { to } = values

    if (!to || to.length === 0) {
      errors.to = 'You should provide at least one recipient'
    } else {
      const recipientErrors = to.map(validateRecipient).filter(i => i)

      if (recipientErrors.length > 0) {
        errors.to = recipientErrors[0]
      }
    }

    return errors
  }, [])

  const scrollToEnd = () => {
    if (emailBodyEditorRef.current) {
      emailBodyEditorRef.current.scrollToEnd()
    }
  }

  const decorators = useMemo(
    () => [
      createDecorator(() => {
        return [
          {
            // we use this decorator to expand to if form is submitted
            // while it has error
            name: 'to',
            focus: () => {
              setTopFieldsCollapsed(false)
            }
          }
        ]
      })
    ],
    []
  )

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
                    autoFocus: (values.to || []).length > 0,
                    'data-test': 'email-subject'
                  }
                }}
                fullWidth
                component={TextField}
              />

              <EmailBody
                ref={emailBodyEditorRef}
                DraftEditorProps={{
                  onFocus: () => setTopFieldsCollapsed(true)
                }}
                hasSignatureByDefault={props.hasSignatureByDefault}
                hasStaticBody={props.hasStaticBody}
                hasTemplateVariables={props.hasTemplateVariables}
                content={initialValues.body || ''}
                attachments={
                  <Field name="attachments" component={AttachmentsList} />
                }
              />
            </div>
            <Footer
              formProps={{ values: formProps.values as EmailFormValues }}
              isSubmitting={submitting}
              isSubmitDisabled={isSubmitDisabled}
              initialAttachments={initialValues.attachments || []}
              deal={props.deal}
              onChanged={scrollToEnd}
            />
          </form>
        )
      }}
    />
  )
}

export default connect()(EmailComposeForm)
