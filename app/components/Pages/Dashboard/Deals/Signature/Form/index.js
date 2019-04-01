import React, { Fragment } from 'react'
import { Field } from 'react-final-form'
import _ from 'underscore'
import Flex from 'styled-flex-component'

import { normalizeAttachments } from 'components/SelectDealFileDrawer/helpers/normalize-attachment'

import ActionButton from 'components/Button/ActionButton'

import { FinalFormDrawer } from 'components/FinalFormDrawer'
import { TextInput } from 'components/Forms/TextInput'
import { TextArea } from 'components/Forms/TextArea'

import { Recipients } from './components/Recipients'
import { AddAttachment } from './components/AddAttachment'
import AttachmentsList from './components/AttachmentsList'

export default class SignatureComposeDrawer extends React.Component {
  state = {
    isAttachmentDrawerOpen: true
  }

  formObject = null

  shouldQuitOnCloseAttachments = true

  get InitialValues() {
    if (this.formObject || this.props.isSubmitting) {
      return this.formObject
    }

    this.initialAttachments = normalizeAttachments(this.props.attachments)

    this.formObject = {
      subject: 'Please DocuSign',
      recipients: {},
      from: `${this.props.user.display_name} <${this.props.user.email}>`,
      attachments: this.initialAttachments
    }

    return this.formObject
  }

  validate = values => {
    const errors = {}

    if (_.size(values.recipients) === 0) {
      errors.recipients = 'Select one recipient at least'
    }

    if (!values.subject) {
      errors.subject = 'Enter email subject'
    }

    if (_.size(values.attachments) === 0) {
      errors.attachments = 'Select one attachment at least'
    }

    return errors
  }

  handleSubmit = async values => {
    this.formObject = values

    return this.props.onSubmit(values)
  }

  handleSelectAttachments = () =>
    this.setState({
      isAttachmentDrawerOpen: false
    })

  handleOpenAttachments = () => {
    this.setState({
      isAttachmentDrawerOpen: true
    })

    this.shouldQuitOnCloseAttachments = false
  }

  handleCloseAttachments = () => {
    this.setState({
      isAttachmentDrawerOpen: false
    })

    if (this.shouldQuitOnCloseAttachments) {
      this.props.onClose()
    }
  }

  render() {
    return (
      <FinalFormDrawer
        formId="signature-compose-form"
        isOpen={this.props.isOpen && !this.state.isAttachmentDrawerOpen}
        initialValues={this.InitialValues}
        onClose={this.props.onClose}
        onSubmit={this.handleSubmit}
        validate={this.validate}
        submitting={this.props.isSubmitting}
        closeDrawerOnBackdropClick={false}
        title="Send for Signatures"
        footerRenderer={props => (
          <Flex alignCenter justifyBetween style={{ width: '100%' }}>
            <Field
              name="attachments"
              isAttachmentDrawerOpen={this.state.isAttachmentDrawerOpen}
              onSelectAttachments={this.handleSelectAttachments}
              handleOpenAttachments={this.handleOpenAttachments}
              handleCloseAttachments={this.handleCloseAttachments}
              deal={this.props.deal}
              initialAttachments={this.initialAttachments}
              component={AddAttachment}
            />

            <ActionButton
              type="submit"
              disabled={this.props.isSubmitting}
              onClick={props.handleSubmit}
            >
              {this.props.isSubmitting
                ? 'Please Wait...'
                : 'Next: View in Docusign'}
            </ActionButton>
          </Flex>
        )}
        render={() => (
          <Fragment>
            <Field
              placeholder="To"
              name="recipients"
              deal={this.props.deal}
              component={Recipients}
            />

            <Field
              placeholder="From"
              name="from"
              style={{
                fontWeight: '500'
              }}
              readOnly
              component={TextInput}
            />

            <Field
              isRequired
              placeholder="Subject"
              name="subject"
              component={TextInput}
            />

            <Field
              labelText="Message"
              placeholder="Write your Message..."
              containerStyle={{
                borderBottom: 'none'
              }}
              name="message"
              minRows={8}
              maxRows={1000}
              component={TextArea}
            />

            <Field name="attachments" component={AttachmentsList} />
          </Fragment>
        )}
      />
    )
  }
}
