import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Field } from 'react-final-form'

import { TextEditor } from 'components/TextEditor'

import { normalizeAttachments } from 'components/SelectDealFileDrawer/helpers/normalize-attachment'

import Loading from '../../../components/Partials/Loading'

import { FinalFormDrawer } from '../FinalFormDrawer'
import { TextInput } from '../Forms/TextInput'
import { MultipleContactsSelect } from '../Forms/MultipleContactsSelect'
import { AttachmentsList } from './fields/Attachments'

import { Footer } from './Footer'

export default class EmailCompose extends React.Component {
  get InitialValues() {
    if (
      (this.formObject && !this.isRecipientsChanged()) ||
      this.props.isSubmitting
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
      body: this.props.hasStaticBody ? '' : this.props.body,
      attachments: this.initialAttachments
    }

    return this.formObject
  }

  isRecipientsChanged = () =>
    (this.formObject.recipients || []).length !==
    (this.props.recipients || []).length

  validate = values => {
    const errors = {}
    const { subject, recipients } = values

    if (!subject || subject.length === 0) {
      errors.subject = 'Please enter the subject'
    }

    if (!recipients || recipients.length === 0) {
      errors.recipients = 'You should select one recipient at least'
    }

    return errors
  }

  handleSubmit = async values => {
    const form = {
      ...values,
      recipients: this.normalizeRecipients(values.recipients)
    }

    return this.props.onClickSend
      ? this.props.onClickSend(form)
      : this.handleSendEmail(form)
  }

  handleSendEmail = form => {
    console.log('>>>>>>', form)
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
        submitting={this.props.isSubmitting}
        closeDrawerOnBackdropClick={false}
        submitButtonLabel="Send"
        submittingButtonLabel="Sending ..."
        title="New Email"
        footerRenderer={data => (
          <Footer
            {...data}
            initialAttachments={this.initialAttachments}
            isSubmitting={this.props.isSubmitting}
            deal={this.props.deal}
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

EmailCompose.propTypes = {
  from: PropTypes.object.isRequired,
  recipients: PropTypes.array,
  isSubmitting: PropTypes.bool,
  defaultAttachments: PropTypes.array,
  hasStaticBody: PropTypes.bool,
  body: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClickSend: PropTypes.func,
  onClose: PropTypes.func.isRequired
}

EmailCompose.defaultProps = {
  recipients: [],
  defaultAttachments: [],
  body: '',
  onClickSend: null,
  isSubmitting: false,
  hasStaticBody: false
}
