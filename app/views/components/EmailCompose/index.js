import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import { browserHistory, withRouter } from 'react-router'

import { Field } from 'react-final-form'

import { TextEditor } from 'components/TextEditor'

import { normalizeAttachments } from 'components/SelectDealFileDrawer/helpers/normalize-attachment'

import { sendContactsEmail } from 'models/email-compose/send-contacts-email'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import { getSendEmailResultMessages } from 'components/EmailCompose/helpers/email-result-messages'

import Loading from '../../../components/Partials/Loading'

import { FinalFormDrawer } from '../FinalFormDrawer'
import { TextInput } from '../Forms/TextInput'
import { MultipleContactsSelect } from '../Forms/MultipleContactsSelect'
import { AttachmentsList } from './fields/Attachments'

import { Footer } from './Footer'

const propTypes = {
  deal: PropTypes.shape(),
  from: PropTypes.object.isRequired,
  recipients: PropTypes.array,
  isSubmitting: PropTypes.bool,
  isSubmitDisabled: PropTypes.bool,
  defaultAttachments: PropTypes.array,
  hasStaticBody: PropTypes.bool,
  body: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClickSend: PropTypes.func,
  /**
   * function of the form email => email
   */
  getEmail: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onSent: PropTypes.func,
  hasDealsAttachments: PropTypes.bool
}

const defaultProps = {
  body: '',
  recipients: [],
  defaultAttachments: [],
  isSubmitDisabled: false,
  onClickSend: null,
  isSubmitting: false,
  onSent: () => {},
  getEmail: email => email,
  hasStaticBody: false,
  hasDealsAttachments: false
}

class EmailCompose extends React.Component {
  state = {
    isSendingEmail: false
  }

  static contextType = ConfirmationModalContext

  get InitialValues() {
    if ((this.formObject && !this.isRecipientsChanged()) || this.IsSubmitting) {
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

  get IsSubmitting() {
    return this.props.isSubmitting || this.state.isSendingEmail
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

  handleSubmit = async values => {
    const form = {
      ...values,
      ...this.associations,
      recipients: this.normalizeRecipients(values.recipients)
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

  needsNotifyButton = () => {
    try {
      const isOnInsights = this.props.router.isActive('/dashboard/insights')

      return !isOnInsights
    } catch (e) {
      return true
    }
  }

  handleSendEmail = async form => {
    const { dispatch } = this.props

    const email = {
      from: form.fromId,
      to: form.recipients,
      subject: (form.subject || '').trim(),
      html: form.body,
      attachments: Object.values(form.attachments).map(item => item.file_id),
      due_at: form.due_at
    }
    const { successMessage, errorMessage } = getSendEmailResultMessages(
      form.recipients.length,
      email.due_at
    )

    try {
      this.setState({
        isSendingEmail: true
      })
      await sendContactsEmail(this.props.getEmail(email))
    } catch (e) {
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

    let notifySuccessOptions = {
      status: 'success',
      message: successMessage
    }

    if (this.needsNotifyButton()) {
      notifySuccessOptions.buttons = [
        {
          name: 'Details',
          primary: true,
          onClick: () => browserHistory.push('/dashboard/insights')
        }
      ]
    }

    dispatch(notify(notifySuccessOptions))

    this.props.onSent()
  }

  normalizeRecipients = recipients =>
    recipients.map(recipient => {
      if (recipient.data_type === 'contact') {
        return {
          contact: recipient.contactId,
          email: recipient.email
        }
      }

      if (recipient.data_type === 'email') {
        return {
          email: recipient.email
        }
      }

      if (recipient.data_type === 'tag') {
        return {
          tag: recipient.text
        }
      }

      return {
        [recipient.data_type]: recipient.id
      }
    })

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
        submitting={this.IsSubmitting}
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
              placeholder="Bcc"
              name="recipients"
              disableAddNewRecipient={this.props.disableAddNewRecipient}
              component={MultipleContactsSelect}
            />

            <Field
              placeholder="From"
              name="from"
              readOnly
              component={TextInput}
            />

            <Field placeholder="Subject" name="subject" component={TextInput} />

            {this.props.hasStaticBody === false && (
              <Field
                name="body"
                defaultValue={this.props.body}
                component={TextEditor}
              />
            )}

            {this.props.hasStaticBody && (
              <Fragment>
                {this.props.body ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: this.props.body
                    }}
                  />
                ) : (
                  <Loading />
                )}
              </Fragment>
            )}

            <Field name="attachments" component={AttachmentsList} />
          </Fragment>
        )}
      />
    )
  }
}

EmailCompose.propTypes = propTypes
EmailCompose.defaultProps = defaultProps

export default connect()(EmailCompose)
