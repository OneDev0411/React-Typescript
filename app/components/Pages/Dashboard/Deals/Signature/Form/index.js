import React, { Fragment } from 'react'
import { Field } from 'react-final-form'
import _ from 'underscore'

import ActionButton from 'components/Button/ActionButton'
import IconButton from 'components/Button/IconButton'
import IconFolder from 'components/SvgIcons/Folder/IconFolder'

import { FinalFormDrawer } from 'components/FinalFormDrawer'
import { TextInput } from 'components/Forms/TextInput'
import { TextArea } from 'components/Forms/TextArea'

import Tooltip from 'components/tooltip'

import { normalizeAttachment } from '../helpers/normalize-attachment'

import { Recipients } from './components/Recipients'
import Attachments from './components/Attachments'

export default class SignatureComposeDrawer extends React.Component {
  state = {
    isAttachmentsOpen: true
  }

  formObject = null

  get InitialValues() {
    if (this.formObject || this.props.isSubmitting) {
      return this.formObject
    }

    this.formObject = {
      subject: '',
      recipients: {},
      from: `${this.props.user.display_name} <${this.props.user.email}>`,
      attachments: this.normalizePreSelectedAttachments(this.props.attachments)
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

  normalizePreSelectedAttachments = attachments => {
    const list = {}

    attachments.forEach(attachment => {
      const item = normalizeAttachment(attachment)

      list[item.id] = item
    })

    return list
  }

  toggleOpenAttachments = () =>
    this.setState(state => ({
      isAttachmentsOpen: !state.isAttachmentsOpen
    }))

  handleCloseAttachments = () => {
    this.setState({
      isAttachmentsOpen: false
    })

    this.props.onClose()
  }

  render() {
    return (
      <Fragment>
        <FinalFormDrawer
          formId="signature-compose-form"
          isOpen={this.props.isOpen && !this.state.isAttachmentsOpen}
          initialValues={this.InitialValues}
          onClose={this.props.onClose}
          onSubmit={this.handleSubmit}
          validate={this.validate}
          submitting={this.props.isSubmitting}
          closeDrawerOnBackdropClick={false}
          title="Send for Signatures"
          footerRenderer={props => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Tooltip caption="Select Documents">
                <IconFolder
                  style={{ width: '2rem', cursor: 'pointer' }}
                  onClick={this.toggleOpenAttachments}
                />
              </Tooltip>

              <ActionButton
                type="submit"
                disabled={this.props.isSubmitting}
                onClick={props.handleSubmit}
              >
                {this.props.isSubmitting
                  ? 'Please Wait...'
                  : 'Next: View in Docusign'}
              </ActionButton>
            </div>
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

              <Field
                name="attachments"
                deal={this.props.deal}
                isAttachmentsOpen={this.state.isAttachmentsOpen}
                onCloseAttachmentsDrawer={this.handleCloseAttachments}
                onChangeSelectedDocuments={this.toggleOpenAttachments}
                component={Attachments}
              />
            </Fragment>
          )}
        />
      </Fragment>
    )
  }
}
