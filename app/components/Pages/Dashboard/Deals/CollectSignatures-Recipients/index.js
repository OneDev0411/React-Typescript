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
      documents: [],
      recipients: {},
      subject: '',
      showSuccessModal: false,
      sending: false
    }
  }

  componentDidMount() {
    this.setState({
      documents: AppStore.data.deals_signatures.documents
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
    catch(e){

    }

    this.setState({
      showSuccessModal: true,
      sending: false
    })

    setTimeout(() => this.setState({
      showSuccessModal: false
    }), 3000)
  }

  render() {

    const { user } = this.props
    const { recipients, documents, sending, subject } = this.state

    return (
      <div className="collect-signatures recipients">

        <h2>Add recipients</h2>

        <FormGroup>
          <ControlLabel>Subject</ControlLabel>
          <FormControl
            type="text"
            placeholder="Please sign document for 1212 Mickinnely ..."
            onChange={ e => this.setState({ subject: e.target.value }) }
          />
        </FormGroup>

        <div>
          <ul>
            <li className="btn">
              <AddSigner
                onSubmit={ this.onAddSigner.bind(this) }
              >
                Add signer
              </AddSigner>
            </li>

            <li className="separator">|</li>
            <li className="btn">
              <AddSigner
                onSubmit={ this.onAddSigner.bind(this) }
                firstName={ user.first_name }
                lastName={ user.last_name }
                email={ user.email }
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
                  <div style={{ color: 'gray' }}>Completed</div>
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
