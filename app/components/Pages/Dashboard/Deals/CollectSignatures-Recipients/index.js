import React from 'react'
import { FormControl, FormGroup, ControlLabel, Button } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import S from 'shorti'
import _ from 'underscore'
import AddSigner from './add-signer'
import AppStore from '../../../../../stores/AppStore'
import Deals from '../../../../../models/Deal'
import MessageModal from '../../../../Partials/MessageModal'

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

    const { deals, forms } = this.props
    const { documents } = AppStore.data.deals_signatures
    const deal = _.find(deals, d => d.id === this.props.params.id)

    const roles = {}

    _.each(documents, doc => {
      const form = _.find(forms, f => f.id === doc.form)

      if (!form.roles)
        return

      _.each(form.roles, r => {
        roles[r.role] = r.role
      })
    })

    this.setState({
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

  async onSubmit() {
    const { subject, documents, recipients } = this.state
    const deal_id = this.props.params.id
    const token = this.props.user.access_token

    this.setState({
      sending: true
    })

    try {
      await Deals.collectSignatures(deal_id, subject, documents, recipients, token)
    }
    catch(e) {
      this.setState({ sending: false })
      return
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
    else
      return address
  }

  render() {

    const { user } = this.props
    const { recipients, documents, sending, subject, deal } = this.state

    return (
      <div className="collect-signatures recipients">

        <div className="close" onClick={ this.close.bind(this) }>
          <i className="fa fa-times fa-1x"></i>
          esc
        </div>

        <h2>Add recipients</h2>

        <FormGroup>
          <ControlLabel>Email Subject</ControlLabel>
          <FormControl
            type="text"
            value={ `Please sign document for ${this.getAddress(deal)}` }
            onChange={ e => this.setState({ subject: e.target.value }) }
          />
        </FormGroup>

        <div>
          <ul>
            <li className="btn">
              <AddSigner
                roles={ this.state.roles }
                onSubmit={ this.onAddSigner.bind(this) }
              >
                Add signer
              </AddSigner>
            </li>

            <li className="separator">|</li>
            <li className="btn">
              <AddSigner
                roles={ this.state.roles }
                firstName={ user.first_name }
                lastName={ user.last_name }
                email={ user.email }
                onSubmit={ this.onAddSigner.bind(this) }
              >
                Add myself
              </AddSigner>
            </li>
          </ul>
        </div>

        <div className="list">
          <ul>
            {
              _.map(recipients, user => {
                return (
                  <li key={`user_${user.email}`}>
                    <div><b>{ user.firstName } { user.lastName }</b></div>
                    <div className="info">{ user.email } | { user.role } </div>
                  </li>
                )
              })
            }
          </ul>
        </div>

        <div className="hr"></div>
        <div style={{ textAlign: 'right'}}>

          <Button
            bsStyle="link"
            style={{ color: 'gray' }}
            onClick={ () => browserHistory.goBack() }
          >
            Back
          </Button>

          <Button
            bsStyle="primary"
            onClick={ this.onSubmit.bind(this) }
            disabled={ !subject || Object.keys(recipients).length === 0 || sending }
          >
            Send
          </Button>
        </div>

        <div className="documents">
          {
            _.map(documents, doc => {
              return (
                <div key={`doc_${doc.id}`} className="doc-detail no-hover">
                  <div className="control">
                    <img src="/static/images/deals/file.png" />
                  </div>
                  <div>{ doc.title }</div>
                  <div style={{ color: 'gray' }}>{ doc.state }</div>
                </div>
              )
            })
          }
        </div>

        <MessageModal
          show={ this.state.showSuccessModal }
          text="Documents Sent"
        />

      </div>
    )
  }
}
