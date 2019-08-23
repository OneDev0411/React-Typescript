import React, { Fragment } from 'react'

import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { Field } from 'react-final-form'
import { TextField } from 'final-form-material-ui'
import createDecorator from 'final-form-focus'
import { isEqual } from 'lodash'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import EmailBody from 'components/EmailCompose/components/EmailBody'

import { FinalFormDrawer } from '../../FinalFormDrawer'
import { AttachmentsList } from '../fields/Attachments'
import { Footer } from '../Footer'
import { EmailComposeDrawerProps, EmailFormValues } from '../types'
import { validateRecipient } from '../../ContactsChipsInput/helpers/validate-recipient'

interface State {
  topFieldsCollapsed: boolean
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
class EmailComposeDrawer extends React.Component<
  EmailComposeDrawerProps,
  State
> {
  static defaultProps: Partial<EmailComposeDrawerProps> = {
    initialValues: {
      to: [],
      cc: [],
      bcc: [],
      subject: '',
      body: '',
      attachments: []
    },
    title: 'New Email',
    isSubmitDisabled: false,
    onSent: () => {},
    onClose: () => {},
    hasStaticBody: false,
    hasDealsAttachments: false
  }

  state = {
    topFieldsCollapsed: false
  }

  focusOnErrors = createDecorator(() => {
    return [
      {
        // we use this decorator to expand to if form is submitted
        // while it has error
        name: 'to',
        focus: () => {
          this.expandTopFields()
        }
      }
    ]
  })

  emailBodyRef = React.createRef<any>()

  static contextType = ConfirmationModalContext

  validate = (values: EmailFormValues) => {
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

    let result: IEmailCampaign

    try {
      result = await this.props.sendEmail(form)
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

    this.props.onSent!(result)
  }

  collapseTopFields = () => this.setState({ topFieldsCollapsed: true })

  expandTopFields = () => this.setState({ topFieldsCollapsed: false })

  render() {
    return (
      <FinalFormDrawer
        formId="email-compose-form"
        disableSubmitByEnter
        isOpen={this.props.isOpen}
        initialValues={this.props.initialValues}
        keepDirtyOnReinitialize
        initialValuesEqual={isEqual}
        onClose={this.props.onClose!}
        onSubmit={this.handleSubmit}
        validate={this.validate}
        decorators={[this.focusOnErrors]}
        closeDrawerOnBackdropClick={false}
        submitButtonLabel="Send"
        submittingButtonLabel="Sending ..."
        title={this.props.title!}
        isSubmitDisabled={this.props.isSubmitDisabled}
        footerRenderer={data => (
          <Footer
            {...data}
            initialAttachments={this.props.initialValues!.attachments || []}
            deal={this.props.deal}
            hasDealsAttachments={this.props.hasDealsAttachments}
          />
        )}
        render={({ values }) => (
          <Fragment>
            {this.state.topFieldsCollapsed ? (
              <div onClick={this.expandTopFields}>
                {this.props.renderCollapsedFields(values)}
              </div>
            ) : (
              this.props.renderFields(values)
            )}

            <Field
              placeholder="Subject"
              name="subject"
              InputProps={{
                onFocus: this.collapseTopFields,
                inputProps: {
                  autoFocus: (values.to || []).length > 0,
                  'data-test': 'email-subject'
                }
              }}
              fullWidth
              component={TextField}
            />

            <EmailBody
              ref={this.emailBodyRef}
              DraftEditorProps={{ onFocus: this.collapseTopFields }}
              hasSignatureByDefault={this.props.hasSignatureByDefault}
              hasStaticBody={this.props.hasStaticBody}
              hasTemplateVariables={this.props.hasTemplateVariables}
              content={this.props.initialValues!.body || ''}
            />

            <Field name="attachments" component={AttachmentsList} />
          </Fragment>
        )}
      />
    )
  }
}

export default connect()(EmailComposeDrawer)
