import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import { addNotification as notify } from 'reapop'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'
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

  componentDidMount() {
    const { esign } = this.props

    this.prefillRoles(esign)
  }

  componentWillReceiveProps(nextProps) {
    const { esign } = nextProps

    this.prefillRoles(esign)
  }

  /**
   * add new recipinet
   */
  addRecipients(recipient) {
    this.props.addEsignRecipient({ role: recipient.id })

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

  /**
   * get all selected forms roles
   */
  getFormsRoles() {
    const { deal, checklists } = this.props
    let roles = []

    // extract roles of selected documents
    deal.checklists.forEach(id => {
      const checklist = checklists[id]

      if (checklist.is_terminated || !checklist.allowed_forms) {
        return false
      }

      checklist.allowed_forms.forEach(form => {
        roles = roles.concat(form.roles)
      })
    })

    // get role names
    return _.chain(roles)
      .pluck('role')
      .uniq()
      .value()
  }

  /**
   * prefill roles based on selected documents
   */
  prefillRoles(esign) {
    if (!esign.show || esign.view !== 'compose') {
      return false
    }

    const { deal, tasks } = this.props
    const { attachments } = esign
    const roleNames = this.getFormsRoles()

    _.each(deal.roles, item => {
      if (roleNames.indexOf(item.role) === -1) {
        return false
      }

      this.addRecipients({ role: item.id })
    })
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

    window.open(DealModel.getEnvelopeEditLink(envelope_id, access_token), '_blank')
  }

  /**
   * send envelope
   */
  async send() {
    const { isSending, failure } = this.state
    const {
      notify,
      createEnvelope,
      closeEsignWizard,
      user,
      deal,
      esign,
      tasks
    } = this.props
    const { recipients } = esign

    const subject = this.subject.value
    const message = this.message.value
    const attachments = esign.attachments.map(id => ({
      revision: tasks[id].submission.last_revision
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

      console.log('1')
      await createEnvelope(envelope)

      console.log('2')
      // close esign
      closeEsignWizard()

      console.log('3')
      // reset recipients
      this.setState({ isSending: false })

      console.log('4')
      const { confirmation } = this.props

      console.log('5')
      confirmation({
        description: 'Would you like to review and finalize this envelope on Docusign?',
        confirmLabel: 'Yes',
        cancelLabel: 'Later',
        onConfirm: () => this.openEditWindow(envelope.id)
      })

      console.log('6')
    } catch (err) {
      const isDocusignError = ~~err.status === 412

      this.setState({
        isSending: false,
        showDocusignBanner: isDocusignError
      })

      if (!isDocusignError) {
        console.trace(err)
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
            <span className="item-title to">To: </span>
            <Recipients
              deal={deal}
              recipients={recipients}
              allowedRoles={this.getFormsRoles()}
              onAddRecipient={recp => this.addRecipients(recp)}
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
