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
import {
  closeEsignWizard,
  showAttachments,
  setEnvelopes,
  addEsignRecipient,
  removeEsignRecipient
} from '../../../../../../store_actions/deals'

const ERROR_MESSAGES = {
  attachments: 'You must select a document at least (from attachments).',
  recipinets: 'You must select one recipient at least.'
}

class SendSignatures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
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
    this.props.addEsignRecipient(recipient)

    if (this.state.error === ERROR_MESSAGES.recipinets) {
      this.setState({
        error: null
      })
    }
  }

  /**
   * remove recipient
   */
  removeRecipient(email) {
    this.props.removeEsignRecipient(email)
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

      this.addRecipients({
        legal_prefix: item.user.legal_prefix,
        legal_first_name: item.user.first_name,
        legal_last_name: item.user.last_name,
        email: item.user.email,
        role: item.role
      })
    })
  }

  closeForm() {
    this.setState({
      error: null
    })
    
    // close form
    this.props.closeEsignWizard()
  }

  /**
   * send envelope
   */
  async send() {
    const { isSending, error } = this.state
    const {
      notify, setEnvelopes, user, deal, esign, tasks
    } = this.props
    const { recipients } = esign

    const subject = this.subject.value
    const message = this.message.value
    const attachments = esign.attachments.map(id => ({
      revision: tasks[id].submission.last_revision
    }))

    if (error) {
      this.setState({ error: null })
    }

    if (_.size(recipients) === 0) {
      this.setState({
        error: ERROR_MESSAGES.recipinets
      })

      return
    }

    if (attachments.length === 0) {
      this.setState({
        error: ERROR_MESSAGES.attachments
      })

      return
    }

    this.setState({
      isSending: true,
      showDocusignBanner: false
    })

    try {
      const envelope = await DealModel.sendEnvelope(
        deal.id,
        subject,
        message,
        attachments,
        recipients
      )

      // add envelope to list of envelopes
      setEnvelopes(deal.id, { [envelope.id]: envelope })

      // close esign
      this.props.closeEsignWizard()

      notify({
        message: 'eSign has been sent',
        status: 'success'
      })

      // reset recipients
      this.setState({ isSending: false })
    } catch (err) {
      const isDocusignError = ~~err.status === 412

      this.setState({
        isSending: false,
        showDocusignBanner: isDocusignError
      })

      if (isDocusignError === false) {
        console.log(err)

        this.setState({
          error:
            'Sorry, something went wrong while sending eSigns. Please try again.'
        })
      }
    }
  }

  render() {
    const {
      tasks, esign, deal, user, showAttachments
    } = this.props
    const { isSending, showDocusignBanner, error } = this.state
    const { recipients } = esign

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
              {error && (
                <div
                  style={{ margin: '0 0 1rem' }}
                  className="c-alert c-alert--error"
                >
                  {error}
                </div>
              )}
              <div>
                <Button
                  disabled={isSending}
                  className="btn-send"
                  onClick={() => this.send()}
                >
                  {isSending ? 'Sending ...' : 'Send'}
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
    setEnvelopes,
    notify
  }
)(SendSignatures)
