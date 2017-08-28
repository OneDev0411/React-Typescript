import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import cn from 'classnames'
import Recipients from './recipients'
import DealModel from '../../../../../../models/Deal'
import { closeEsign, showAttachments } from '../../../../../../store_actions/deals'
import ComposeAttachments from './compose-attachments'
import config from '../../../../../../../config/public'

class SendSignatures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipients: {},
      isSending: false
    }
  }

  componentWillReceiveProps(nextProps) {
    const { esign } = nextProps
    if (esign.show && esign.view === 'compose') {
      this.prefillRoles(esign.attachments)
    }
  }

  /**
   * add new recipinet
   */
  addRecipients(recp) {
    const { recipients } = this.state
    this.setState({
      recipients: {
        ...recipients,
        [recp.email]: recp
      }
    })
  }

  /**
   * remove recipient
   */
  removeRecipient(email) {
    const recipients = _.filter(this.state.recipients, recp => recp.email !== email)
    this.setState({ recipients })
  }

  /**
   * prefill roles based on selected documents
   */
  prefillRoles(attachments) {
    const { tasks, forms, deal } = this.props
    let roles = []

    // extract roles of selected documents
    attachments.forEach(id => {
      const formId = tasks[id].submission.form
      roles = roles.concat(forms[formId].roles)
    })

    // get role names
    const roleNames = _.pluck(roles, 'role')

    _.each(deal.roles, item => {

      if (roleNames.indexOf(item.role) === -1) {
        return false
      }

      this.addRecipients({
        first_name: item.user.first_name,
        last_name: item.user.last_name,
        email: item.user.email,
        role: item.role
      })
    })
  }

  /**
   * send envelope
   */
  async send() {
    const { recipients, isSending } = this.state
    const { closeEsign, user, deal, esign, tasks } = this.props
    const subject = this.subject.value
    const message = this.message.value
    const attachments = esign.attachments.map(id => {
      return { revision: tasks[id].submission.last_revision }
    })

    this.setState({
      isSending: true
    })

    try {
      await DealModel.sendEnvelope(
        deal.id,
        subject,
        message,
        attachments,
        recipients
      )
      // close esign
      closeEsign()

    } catch(e) {
      this.setState({ isSending: false })

      if (~~e.status === 412)
        this.loginToDocusign()

      return false
    }

    this.setState({
      isSending: false
    })
  }

  /**
   * open login-to-docusign popup
   */
  loginToDocusign() {
    const { user } = this.props
    const token = user.access_token
    const login = window.open(`${config.app.url}/api/deals/docusign/login?access_token=${token}`,
      'sharer', 'toolbar=0,status=0,width=548,height=325')

    window.addEventListener('message', (event) => {
      login.close()
      setTimeout(() => {
        this.send()
      }, 100)
    }, false)
  }

  render() {
    const { tasks, esign, deal, user } = this.props
    const { recipients, isSending } = this.state

    if (!esign.show || esign.view !== 'compose') {
      return false
    }

    return (
      <div className="send-esigns">
        <div className="header">
          Send for Signatures

          <span
            className="close-compose"
            onClick={() => this.props.closeEsign()}
          >
            <i className="fa fa-times" />
          </span>
        </div>

        <div className="recipients">
          <span className="item-title to">To: </span>

          <Recipients
            recipients={recipients}
            roles={deal.roles}
            onAddRecipients={recp => this.addRecipients(recp)}
            onRemoveRecipient={email => this.removeRecipient(email)}
          />
        </div>

        <div className="subject">
          <span className="item-title">Subject: </span>
          <input
            defaultValue={`Please sign document for ${DealModel.get.field(deal, 'full_address')}`}
            ref={ref => this.subject = ref}
            type="text"
          />
        </div>

        <div className="message">
          <Textarea
            inputRef={ref => this.message = ref}
            maxRows={10}
            placeholder="Write your message here ..."
          />
          <div className="signature">
            <p>{ user.display_name }</p>
          </div>

          <ComposeAttachments
            esign={esign}
            tasks={tasks}
          />
        </div>

        <div className="footer">
          <Button
            disabled={isSending}
            className="btn-send"
            onClick={() => this.send()}
          >
            { isSending ? 'Sending' : 'Send' }
          </Button>

          <Button
            disabled={isSending}
            onClick={() => this.props.showAttachments(esign.attachments)}
            className="btn-attach"
          >
            <i className="fa fa-paperclip fa-rotate-90" /> Attach
          </Button>
        </div>

      </div>
    )
  }
}

export default connect(({ deals, data }) => ({
  user: data.user,
  forms: deals.forms,
  tasks: deals.tasks,
  esign: deals.esign || {}
}), { showAttachments, closeEsign })(SendSignatures)
