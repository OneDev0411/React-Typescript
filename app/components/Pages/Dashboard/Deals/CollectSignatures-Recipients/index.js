import React from 'react'
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import AddSigner from './add-signer'
import AppStore from '../../../../../stores/AppStore'
import Dispatcher from '../../../../../dispatcher/DealDispatcher'
import MessageModal from '../../../../Partials/MessageModal'
import config from '../../../../../../config/public'

export default class CollectSignaturesRecipients extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      deal: null,
      documents: [],
      recipients: {},
      roles: {},
      subject: '',
      showSuccessModal: false,
      sending: false
    }
  }

  componentDidMount() {
    const { deals, params } = this.props
    const forms = deals.forms
    const { documents } = AppStore.data.deals.signatures
    const deal = deals.list[params.id]

    const roles = {}

    _.each(documents, (doc) => {
      const form = _.find(forms, f => f.id === doc.form)

      if (form && !form.roles)
        return

      _.each(form.roles, (r) => {
        roles[r.role] = r.role
      })
    })

    // prefill roles
    // see https://bitbucket.org/rechat/server/issues/664/prefill-roles-on-collect-signatures-view
    _.each(deal.roles, (rl) => {
      if (roles[rl.role]) {
        const user = {
          firstName: rl.user.first_name,
          lastName: rl.user.last_name,
          email: rl.user.email,
          role: rl.role
        }
        this.onAddSigner(user)
      }
    })

    this.setState({
      subject: `Please sign document for ${this.getAddress(deal)}`,
      deal,
      documents,
      roles
    })
  }

  onAddSigner(user) {
    const { recipients } = this.state
    recipients[user.email] = user
    this.setState({ recipients })
  }

  deleteSigner(user) {
    const { recipients } = this.state
    delete recipients[user.email]
    this.setState({ recipients })
  }

  async onSubmit() {
    const { subject, documents, recipients, sending } = this.state
    const { user, params } = this.props
    const deal_id = params.id

    if (sending)
      return

    this.setState({
      sending: true
    })

    try {
      await Dispatcher.dispatchSync({
        action: 'create-envelope',
        deal_id,
        subject,
        documents,
        recipients,
        user
      })
    } catch(e) {
      console.log(e)
      this.setState({ sending: false })

      if (~~e.status === 412)
        this.loginToDocusign()

      return false
    }

    this.setState({
      showSuccessModal: true,
      sending: false
    })

    setTimeout(() => {
      this.setState({ showSuccessModal: false })
      browserHistory.push(`/dashboard/deals/${this.props.params.id}/esigns`)
    }, 3000)
  }

  loginToDocusign() {
    const token = this.props.user.access_token
    const login = window.open(`${config.app.url}/api/deals/docusign/login?access_token=${token}`,
      'sharer', 'toolbar=0,status=0,width=548,height=325')

    window.addEventListener('message', (event) => {
      login.close()
      setTimeout(() => {
        this.onSubmit()
      }, 100)
    }, false)
  }

  close() {
    browserHistory.push(`/dashboard/deals/${this.props.params.id}`)
  }

  getAddress(deal) {
    if (!deal)
      return

    let address = '-'

    if (deal.context && deal.context.street_address)
      address = deal.context.street_address
    else if (deal.proposed_values && deal.proposed_values.street_address)
      address = deal.proposed_values.street_address

    if (address.endsWith(','))
      return address.substring(0, address.length - 1)
    return address
  }

  render() {
    const { user } = this.props
    const { recipients, documents, sending, subject, deal } = this.state

    return (
      <div className="collect-signatures recipients">

        <div className="close" onClick={this.close.bind(this)}>
          <i className="fa fa-times fa-1x" />
          esc
        </div>

        <h2>Add recipients</h2>

        <FormGroup>
          <ControlLabel>Email Subject</ControlLabel>
          <FormControl
            type="text"
            style={{ width: '60%' }}
            value={subject}
            onChange={e => this.setState({ subject: e.target.value })}
          />
        </FormGroup>

        <div>
          <ul>
            <li className="btn">
              <AddSigner
                roles={this.state.roles}
                onSubmit={this.onAddSigner.bind(this)}
              >
                Add signer
              </AddSigner>
            </li>

            <li className="separator">|</li>
            <li className="btn">
              <AddSigner
                roles={this.state.roles}
                firstName={user.first_name}
                lastName={user.last_name}
                email={user.email}
                onSubmit={this.onAddSigner.bind(this)}
              >
                Add myself
              </AddSigner>
            </li>
          </ul>
        </div>

        <div className="list">
          <ul>
            {
              _.map(recipients, user => (
                <li key={`user_${user.email}`}>
                  <span
                    onClick={this.deleteSigner.bind(this, user)}
                  >
                    <i className="fa fa-times" />
                  </span>
                  <div><b>{ user.firstName } { user.lastName }</b></div>
                  <div className="info">{ user.email } | { user.role } </div>
                </li>
                ))
            }
          </ul>
        </div>

        <div className="hr" />
        <div style={{ textAlign: 'right' }}>

          <Button
            bsStyle="link"
            style={{ color: 'gray' }}
            onClick={() => browserHistory.goBack()}
          >
            Back
          </Button>

          <Button
            bsStyle="primary"
            onClick={this.onSubmit.bind(this)}
            disabled={!subject || _.size(recipients) === 0 || sending}
          >
            Send
          </Button>
        </div>

        <div className="documents">
          {
            _.map(documents, doc => (
              <div key={`doc_${doc.id}`} className="doc-detail no-hover">
                <div className="control">
                  <img src="/static/images/deals/file.png" />
                </div>
                <div>{ doc.title }</div>
                <div style={{ color: 'gray' }}>Completed</div>
              </div>
              ))
          }
        </div>

        <MessageModal
          show={this.state.showSuccessModal}
          text="Documents Sent"
        />

      </div>
    )
  }
}
