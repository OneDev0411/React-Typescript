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
import { closeEsign, showAttachments, setEnvelopes } from '../../../../../../store_actions/deals'

class SendSignatures extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      recipients: {},
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
    return _
      .chain(roles)
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
        first_name: item.user.first_name,
        last_name: item.user.last_name,
        email: item.user.email,
        role: item.role
      })
    })
  }

  closeForm() {
    const { closeEsign } = this.props

    //close form
    closeEsign()

    // reset recipients
    this.setState({
      recipients: {}
    })
  }
  /**
   * send envelope
   */
  async send() {
    const { recipients, isSending } = this.state
    const { notify, closeEsign, setEnvelopes, user, deal, esign, tasks } = this.props
    const subject = this.subject.value
    const message = this.message.value
    const attachments = esign.attachments.map(id => {
      return { revision: tasks[id].submission.last_revision }
    })

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
      setEnvelopes(deal.id, [envelope])

      // close esign
      closeEsign()

      notify({
        message: 'eSign has been sent',
        status: 'success'
      })

      // reset recipients
      this.setState({
        recipients: {},
        isSending: false
      })

    } catch(e) {
      const isDocusignError = ~~e.status === 412

      this.setState({
        isSending: false,
        showDocusignBanner: isDocusignError
      })

      if (isDocusignError === false) {
        notify({
          message: e.response ?
            e.response.body.message :
            'Can not send eSign, please try again',
          status: 'error'
        })
      }
    }
  }

  render() {
    const { tasks, esign, deal, user, showAttachments } = this.props
    const { recipients, isSending, showDocusignBanner } = this.state

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

            <span
              className="close-compose"
              onClick={() => this.closeForm()}
            >
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
              defaultValue={`Please sign document for ${DealModel.get.field(deal, 'full_address')}`}
              ref={ref => this.subject = ref}
              type="text"
            />
          </div>

          <div className="message">
            <Textarea
              inputRef={ref => this.message = ref}
              maxRows={8}
              placeholder="Write your message here ..."
            />
            <div className="signature">
              <p>{ user.display_name }</p>
            </div>
          </div>

          <div className="attachments">
            <ComposeAttachments
              esign={esign}
              deal={deal}
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
              onClick={() => showAttachments(esign.attachments, { showCompose: true })}
              className="btn-attach"
            >
              <i className="fa fa-paperclip fa-rotate-90" /> Attach
            </Button>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(({ deals, data }) => ({
  user: data.user,
  tasks: deals.tasks,
  checklists: deals.checklists,
  esign: deals.esign || {}
}), { showAttachments, closeEsign, setEnvelopes, notify })(SendSignatures)
