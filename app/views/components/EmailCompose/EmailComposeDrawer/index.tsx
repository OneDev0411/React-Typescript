import React, { Fragment, ReactElement } from 'react'

import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Field } from 'react-final-form'

import { FormLabel } from '@material-ui/core'

import { TextField } from 'final-form-material-ui'

import { InputProps } from '@material-ui/core/Input'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import EmailBody from 'components/EmailCompose/components/EmailBody'
import { normalizeAttachments } from 'components/SelectDealFileDrawer/helpers/normalize-attachment'
import { uploadEmailAttachment } from 'models/email-compose/upload-email-attachment'

import { FinalFormDrawer } from '../../FinalFormDrawer'
import { AttachmentsList } from '../fields/Attachments'

import { Footer } from '../Footer'

interface Props {
  from: {
    id: string
    display_name: string
    email: string
  }
  sendEmail: (values: ComposeFormValues) => Promise<any>
  isOpen: boolean
  getSendEmailResultMessages: (
    values: ComposeFormValues
  ) => { successMessage: string; errorMessage: string }
  onSent: () => void
  onClose: () => void
  deal?: IDeal
  body?: string
  recipients?: any[] // FIXME: replace any with proper type
  defaultAttachments?: any[] // FIXME: replace any with proper type
  isSubmitDisabled?: boolean
  hasStaticBody?: boolean
  hasDealsAttachments?: boolean
  hasSignatureByDefault?: boolean
  hasTemplateVariables?: boolean

  dispatch: any // Extending DispatchProps seems to have problems
  signature: string
  children: ReactElement<any>
}

interface State {
  isSendingEmail: boolean
}

interface ComposeFormValues {
  attachments: any
  recipients: any[] | undefined
  subject: string
  from: string
  due_at: string
  body: string | undefined
  fromId: any
}

/**
 * Shared parts of the different email compose drawers.
 * Currently there are two types of email compose:
 *  - Batch ({@link BulkEmailComposeDrawer})
 *  - Single ({@link SingleEmailComposeDrawer})
 * Difference between these types are:
 * - Different way of sending email (different endpoint and DTOs)
 * - Some UI differences in the input form.
 *
 * These differences are abstracted away from EmailComposeDrawer
 * as props to be provided by concrete email compose drawer components.
 */
class EmailComposeDrawer extends React.Component<Props, State> {
  static defaultProps = {
    body: '',
    recipients: [],
    defaultAttachments: [],
    isSubmitDisabled: false,
    onSent: () => {},
    hasStaticBody: false,
    hasDealsAttachments: false
  }

  state = {
    isSendingEmail: false
  }

  emailBodyRef = React.createRef<any>()

  static contextType = ConfirmationModalContext

  private formObject: ComposeFormValues

  private initialAttachments: any[]

  get InitialValues() {
    if (
      (this.formObject && !this.isRecipientsChanged()) ||
      this.state.isSendingEmail
    ) {
      return this.formObject
    }

    this.initialAttachments = normalizeAttachments(
      this.props.defaultAttachments
    )

    this.formObject = {
      fromId: this.props.from.id,
      from: `${this.props.from.display_name} <${this.props.from.email}>`,
      recipients: this.props.recipients,
      subject: '',
      body: this.props.hasStaticBody ? '' : this.props.body,
      attachments: this.initialAttachments,
      due_at: ''
    }

    return this.formObject
  }

  isRecipientsChanged = () =>
    (this.formObject.recipients || []).length !==
    (this.props.recipients || []).length

  validate = values => {
    const errors: { [key in keyof ComposeFormValues]?: string } = {}
    const { recipients } = values

    if (!recipients || recipients.length === 0) {
      errors.recipients = 'You should select one recipient at least'
    }

    return errors
  }

  handleSubmit = async form => {
    if (
      this.emailBodyRef.current &&
      this.emailBodyRef.current.hasUploadingImage()
    ) {
      return new Promise((resolve, reject) => {
        this.context.setConfirmationModal({
          message: 'Upload in progress',
          description: 'Please wait while images are uploading, or remove them',
          cancelLabel: 'Ok',
          needsConfirm: false,
          onCancel: reject
        })
      })
    }

    if ((form.subject || '').trim() === '') {
      return new Promise((resolve, reject) => {
        this.context.setConfirmationModal({
          message: 'Send without subject?',
          description:
            'This email has no subject. Are you sure you want to send it?',
          confirmLabel: 'Send anyway',
          onCancel: reject,
          onConfirm: () => {
            this.handleSendEmail(form)
              .then(resolve)
              .catch(reject)
          }
        })
      })
    }

    return this.handleSendEmail(form)
  }

  handleSendEmail = async form => {
    const { dispatch } = this.props

    const {
      successMessage,
      errorMessage
    } = this.props.getSendEmailResultMessages(form)

    try {
      this.setState({
        isSendingEmail: true
      })
      await this.props.sendEmail(form)
    } catch (e) {
      console.error('error in sending email', e)

      return dispatch(
        notify({
          status: 'error',
          message: errorMessage
        })
      )
    } finally {
      this.setState({
        isSendingEmail: false
      })
    }

    dispatch(
      notify({
        status: 'success',
        message: successMessage
      })
    )

    this.props.onSent()
  }

  uploadImage = async file => {
    const uploadedFile = await uploadEmailAttachment(file)

    return uploadedFile.url
  }

  render() {
    return (
      <FinalFormDrawer
        formId="email-compose-form"
        disableSubmitByEnter
        isOpen={this.props.isOpen}
        initialValues={this.InitialValues}
        onClose={this.props.onClose}
        onSubmit={this.handleSubmit}
        validate={this.validate}
        submitting={this.state.isSendingEmail}
        closeDrawerOnBackdropClick={false}
        submitButtonLabel="Send"
        submittingButtonLabel="Sending ..."
        title="New Email"
        isSubmitDisabled={this.props.isSubmitDisabled}
        footerRenderer={data => (
          <Footer
            {...data}
            initialAttachments={this.initialAttachments}
            deal={this.props.deal}
            hasDealsAttachments={this.props.hasDealsAttachments}
          />
        )}
        render={() => (
          <Fragment>
            <Field
              component={TextField}
              InputProps={
                {
                  startAdornment: (
                    <FormLabel style={{ marginRight: '1rem' }}>From</FormLabel>
                  ),
                  disableUnderline: true,
                  readOnly: true
                } as InputProps
              }
              fullWidth
              margin="dense"
              name="from"
            />

            {this.props.children}

            <Field
              data-test="email-subject"
              placeholder="Subject"
              name="subject"
              margin="normal"
              fullWidth
              component={TextField}
            />

            <EmailBody
              ref={this.emailBodyRef}
              hasSignatureByDefault={this.props.hasSignatureByDefault}
              hasStaticBody={this.props.hasStaticBody}
              hasTemplateVariables={this.props.hasTemplateVariables}
              uploadImage={this.uploadImage}
              content={this.props.body}
            />

            <Field name="attachments" component={AttachmentsList} />
          </Fragment>
        )}
      />
    )
  }
}

export default connect()(EmailComposeDrawer)
