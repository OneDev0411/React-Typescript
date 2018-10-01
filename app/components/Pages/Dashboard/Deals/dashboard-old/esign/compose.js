import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { Button } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import _ from 'underscore'
import Recipients from './recipients'
import ComposeAttachments from './compose-attachments'
import Docusign from './docusign'
import DealModel from '../../../../../../models/Deal'
import Alert from '../../../Partials/Alert'
import {
  closeEsignWizard,
  showAttachments,
  createEnvelope,
  addEsignRecipient,
  removeEsignRecipient
} from '../../../../../../store_actions/deals'
import { confirmation } from '../../../../../../store_actions/confirmation'

const ERROR_MESSAGES = {
  attachments: 'Please select a document to attach.',
  recipinets: 'Please select at least one recipient.'
}

class SendSignatures extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      failure: null,
      isSending: false,
      showDocusignBanner: false
    }
  }

  /**
   * add new recipinet
   */
  addRecipients(recipient, order) {
    this.props.addEsignRecipient({ role: recipient.id, order })

    if (this.state.failure === ERROR_MESSAGES.recipinets) {
      this.setState({
        failure: null
      })
    }
  }

  /**
   * remove recipient
   */
  removeRecipient(id) {
    this.props.removeEsignRecipient(id)
  }


  closeForm() {
    this.setState({
      failure: null
    })

    // close form
    this.props.closeEsignWizard()
  }

  openEditWindow(envelope_id) {
    const { user } = this.props
    const { access_token } = user

    window.open(
      DealModel.getEnvelopeEditLink(envelope_id, access_token),
      '_blank'
    )
  }

  /**
   * send envelope
   */
  async send() {
    const { failure } = this.state
    const { createEnvelope, closeEsignWizard, deal, esign } = this.props
    const { recipients } = esign

    const subject = this.subject.value
    const message = this.message.value
    const attachments = esign.attachments.map(attachment => ({
      revision: attachment.revision,
      file: attachment.file_id
    }))

    if (failure) {
      this.setState({ failure: null })
    }

    if (_.size(recipients) === 0) {
      this.setState({
        failure: {
          type: 'error',
          message: ERROR_MESSAGES.recipinets
        }
      })

      return false
    }

    if (attachments.length === 0) {
      this.setState({
        failure: {
          type: 'error',
          message: ERROR_MESSAGES.attachments
        }
      })

      return false
    }

    this.setState({
      isSending: true,
      showDocusignBanner: false
    })

    try {
      // add envelope to list of envelopes
      const envelope = await DealModel.sendEnvelope(
        deal.id,
        subject,
        message,
        attachments,
        recipients
      )

      await createEnvelope(envelope)

      // close esign
      closeEsignWizard()

      // reset recipients
      this.setState({ isSending: false })

      const { confirmation } = this.props

      confirmation({
        description: 'Review and send this envelope?',
        confirmLabel: 'Yes',
        cancelLabel: 'No, Save Draft',
        onConfirm: () => this.openEditWindow(envelope.id)
      })
    } catch (e) {
      console.log(e)

      const isDocusignError = ~~e.status === 412

      this.setState({
        isSending: false,
        showDocusignBanner: isDocusignError
      })

      if (!isDocusignError) {
        this.setState({
          failure: {
            code: 500,
            type: 'error'
          }
        })
      }
    }
  }

  render() {
    const { tasks, esign, deal, user, showAttachments } = this.props
    const { isSending, showDocusignBanner, failure } = this.state
    const { recipients } = esign
    const hasRecipients = Object.keys(recipients).length > 0

    if (!esign.showCompose) {
      return false
    }

    return (
      <div>
        <Docusign
          show={showDocusignBanner}
          user={user}
          onAuthorize={() => this.send()}
        />

        <div className="send-esigns">
          <div className="header">
            Send for Signatures
            <span className="close-compose" onClick={() => this.closeForm()}>
              <i className="fa fa-times" />
            </span>
          </div>

          <div className="recipients">
            <Recipients
              deal={deal}
              recipients={recipients}
              onAddRecipient={(recp, order) => this.addRecipients(recp, order)}
              onRemoveRecipient={email => this.removeRecipient(email)}
            />
          </div>

          <div className="subject">
            <span className="item-title">Subject: </span>
            <input
              defaultValue={`Please sign document for ${DealModel.get.field(
                deal,
                'full_address'
              )}`}
              ref={ref => (this.subject = ref)}
              type="text"
            />
          </div>

          <div className="message">
            <Textarea
              inputRef={ref => (this.message = ref)}
              maxRows={8}
              placeholder="Write your message here ..."
            />
            <div className="signature">{user.display_name}</div>
          </div>

          <div className="footer">
            <div className="attachments">
              <ComposeAttachments esign={esign} deal={deal} tasks={tasks} />
            </div>

            <div className="footer__inner">
              {failure && <Alert {...failure} style={{ margin: '0 0 1rem' }} />}
              <div>
                <Button
                  disabled={isSending || !hasRecipients}
                  className="btn-send"
                  onClick={() => this.send()}
                >
                  {isSending ? 'Creating...' : 'Review'}
                </Button>

                <Button
                  disabled={isSending}
                  onClick={() => showAttachments(true)}
                  className="btn-attach"
                >
                  <i className="fa fa-paperclip fa-rotate-90" /> Attach
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(
  ({ deals, data }) => ({
    user: data.user,
    tasks: deals.tasks,
    checklists: deals.checklists,
    esign: deals.esign || {}
  }),
  {
    addEsignRecipient,
    removeEsignRecipient,
    showAttachments,
    closeEsignWizard,
    createEnvelope,
    notify,
    confirmation
  }
)(SendSignatures)
