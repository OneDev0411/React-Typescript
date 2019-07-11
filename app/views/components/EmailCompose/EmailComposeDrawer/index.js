import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'

import { Field } from 'react-final-form'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import EmailBody from 'components/EmailCompose/components/EmailBody'

import { normalizeAttachments } from 'components/SelectDealFileDrawer/helpers/normalize-attachment'

import { FinalFormDrawer } from '../../FinalFormDrawer'
import { TextInput } from '../../Forms/TextInput'
import { AttachmentsList } from '../fields/Attachments'

import { Footer } from '../Footer'
import { normalizeRecipients } from '../helpers/normalize-recepients'

const propTypes = {
  deal: PropTypes.shape(),
  from: PropTypes.object.isRequired,
  recipients: PropTypes.array,
  isSubmitDisabled: PropTypes.bool,
  defaultAttachments: PropTypes.array,
  hasStaticBody: PropTypes.bool,
  body: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  sendEmail: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onSent: PropTypes.func,
  hasDealsAttachments: PropTypes.bool,
  getSendEmailResultMessages: PropTypes.func.isRequired,
  children: PropTypes.element
}

const defaultProps = {
  body: '',
  recipients: [],
  defaultAttachments: [],
  isSubmitDisabled: false,
  onSent: () => {},
  hasStaticBody: false,
  hasDealsAttachments: false
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
class EmailComposeDrawer extends React.Component {
  state = {
    isSendingEmail: false
  }

  static contextType = ConfirmationModalContext

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
    const errors = {}
    const { recipients } = values

    if (!recipients || recipients.length === 0) {
      errors.recipients = 'You should select one recipient at least'
    }

    return errors
  }

  handleSubmit = async form => {
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
            {this.props.children}

            <Field
              placeholder="From"
              name="from"
              readOnly
              component={TextInput}
            />

            <Field
              data-test="email-subject"
              placeholder="Subject"
              name="subject"
              component={TextInput}
            />

            <EmailBody
              hasStaticBody={this.props.hasStaticBody}
              content={this.props.body}
            />

            <Field name="attachments" component={AttachmentsList} />
          </Fragment>
        )}
      />
    )
  }
}

EmailComposeDrawer.propTypes = propTypes
EmailComposeDrawer.defaultProps = defaultProps

export default connect()(EmailComposeDrawer)
