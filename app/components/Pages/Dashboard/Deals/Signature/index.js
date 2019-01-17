import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'

import { confirmation } from 'actions/confirmation'
import { createEnvelope } from 'actions/deals'

import Deal from 'models/Deal'
import { getEnvelopeEditLink } from 'models/Deal/helpers/get-envelope-edit-link'

import ActionButton from 'components/Button/ActionButton'

import SignatureComposeDrawer from './Form'
import { Docusign } from './Docusign'

class Signature extends React.Component {
  state = {
    isFormOpen: false,
    isSending: false,
    showDocusignBanner: false,
    formData: null
  }

  toggleOpenForm = () =>
    this.setState(state => ({
      isFormOpen: !state.isFormOpen
    }))

  handleSubmit = async values => {
    const formData = this.state.formData || values

    const attachments = _.map(formData.attachments, attachment => ({
      revision: attachment.revision,
      file: attachment.file_id
    }))

    const recipients = _.map(formData.recipients, recipient => ({
      role: recipient.id,
      order: recipient.order,
      envelope_recipient_type: recipient.envelope_recipient_type
    }))

    this.setState({
      isSending: true,
      showDocusignBanner: false
    })

    try {
      // add envelope to list of envelopes
      const envelope = await Deal.sendEnvelope(
        this.props.deal.id,
        formData.subject,
        formData.message,
        attachments,
        recipients
      )

      await this.props.createEnvelope(envelope)

      // reset recipients
      this.setState({ isSending: false, isFormOpen: false, formData: null })

      this.props.confirmation({
        description: 'Your envelope is ready',
        confirmLabel: 'Review in Docusign',
        hideCancelButton: true,
        onConfirm: () => this.openDocusign(envelope)
      })
    } catch (e) {
      console.log(e)

      const isDocusignError = ~~e.status === 412

      this.setState({
        isSending: false,
        showDocusignBanner: isDocusignError,
        formData: isDocusignError ? values : null
      })
    }
  }

  openDocusign = envelope => {
    const url = getEnvelopeEditLink(envelope.id, this.props.user.access_token)

    window.open(url, '_blank')
  }

  render() {
    return (
      <Fragment>
        <ActionButton
          appearance="outline"
          size="small"
          style={{ marginLeft: '0.5rem' }}
          onClick={this.toggleOpenForm}
        >
          E-Sign
        </ActionButton>
        {this.state.isFormOpen && (
          <Fragment>
            <SignatureComposeDrawer
              isOpen={!this.state.showDocusignBanner}
              isSubmitting={this.state.isSending}
              user={this.props.user}
              deal={this.props.deal}
              onSubmit={this.handleSubmit}
              attachments={this.props.defaultAttachments}
              onClose={this.toggleOpenForm}
            />

            <Docusign
              isOpen={this.state.showDocusignBanner}
              user={this.props.user}
              onAuthorize={this.handleSubmit}
            />
          </Fragment>
        )}
      </Fragment>
    )
  }
}

function mapStateToProps({ user }) {
  return { user }
}

export default connect(
  mapStateToProps,
  {
    createEnvelope,
    confirmation,
    notify
  }
)(Signature)
