import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { Row, Col, Button } from 'react-bootstrap'
import MessageModal from '../../../../Partials/MessageModal'
import AppDispatcher from '../../../../../dispatcher/AppDispatcher'
import config from '../../../../../../config/public'

export default class EditForm extends React.Component {
  constructor(props) {
    super(props)

    if (process.env.NODE_ENV === 'development')
      config.forms.url = 'http://localhost:3000'

    this.state = {
      loaded: false,
      deal: null,
      submission: null,
      incompleteFields: null,
      initial: null,
      saving: false,
      showSuccessModal: false
    }
  }

  componentDidMount() {
    const { deals, params } = this.props

    // get deal
    const deal = _.find(deals, deal => deal.id === params.id)

    // get submission
    const submission = _.find(deal.submissions, subm => subm.form === params.form)

    // if submission not found back to deals dashboard
    if (!submission && params.type === 'update')
      return browserHistory.push(`/dashboard/deals/${params.id}`)

    if (submission && !submission.values)
      this.getSubmissionForm(submission.last_revision)

    // connect to iframe
    this.connect()

    // set states
    this.setState({ deal, submission })
  }

  componentWillReceiveProps(nextProps) {
    const deal = _.find(nextProps.deals, deal => deal.id === nextProps.params.id)
    const submission = _.find(deal.submissions, subm => subm.form === nextProps.params.form)

    if (deal.saving_form !== this.state.saving && deal.saving_form === false) {
      this.setState({
        saving: deal.saving_form,
        showSuccessModal: true
      })

      setTimeout(() => {
        this.setState({ showSuccessModal: false})

        if (nextProps.params.type === 'create')
          this.goback()

      }, 2000)
    }

    if (submission && submission.form_data && !this.state.initial)
      this.setState({ initial: submission.form_data })
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.frame !== null
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.receiveMessage)
    ReactDOM.unmountComponentAtNode(this.frame)
  }

  onLoad() {
    this.changeState({ loaded: true })

    // set deal
    this.sendMessage('setDeal', [this.state.deal])
  }

  onSetDeal() {
    const { initial } = this.state

    if (initial !== null)
      this.sendMessage('setValues', [initial.values])
  }

  onUpdate(data) {
    this.sendMessage('incompleteFields')
  }

  onSubmit(data) {
    this.sendMessage('incompleteFields')
  }

  onIncompleteFields(data) {
    this.changeState({ incompleteFields: data })
  }

  onSetValues(data) {

  }

  onGetValues(data) {
    this.saveForm(data)
  }

  onSave() {
    this.sendMessage('getValues')
  }

  connect() {
    window.addEventListener('message', this.receiveMessage.bind(this), false)
  }

  sendMessage(fn, args) {
    if (!this.frame)
      return

    const win = this.frame.contentWindow
    win.postMessage({ fn, args }, '*')
  }

  receiveMessage(event) {
    const { type, fn, args } = event.data

    // make first case of function uppercase
    const func = `on${fn.charAt(0).toUpperCase()}${fn.slice(1)}`

    // call function
    this[func](args)
  }

  async changeState(state, sync = false) {
    if (!this.frame)
      return

    return new Promise(resolve => {
      if (sync) {
        this.setState(state, resolve)
      }
      else {
        this.setState(state)
        resolve()
      }
    })
  }

  getSubmissionForm(last_revision) {
    const { user, params } = this.props
    AppDispatcher.dispatch({
      action: 'get-submission-form',
      user: user,
      deal: params.id,
      last_revision
    })
  }

  async saveForm(values) {
    const { user, params } = this.props
    const { incompleteFields, submission } = this.state

    if (this.state.saving || !this.frame)
      return

    await this.changeState({ saving: true }, true)

    AppDispatcher.dispatch({
      action: 'save-submission-form',
      user: user,
      type: params.type,
      deal: params.id,
      form: params.form,
      state: incompleteFields && incompleteFields.length > 0 ? 'Draft' : 'Fair',
      submission: submission ? submission.id : null,
      values
    })
  }

  goback() {
    browserHistory.push(`/dashboard/deals/${this.props.params.id}`)
  }

  render() {
    const { submission, loaded, incompleteFields, saving } = this.state
    const token = this.props.user.access_token

    return (
      <div className="edit-form">

        <Row className="toolbar">
          <Col xs={9} sm={9} md={9} className="messages">
            <div>
              <b>{ submission && submission.title }</b>
            </div>
            {
              incompleteFields && incompleteFields.length > 0 &&
              <span>{ incompleteFields.length } incomplete fields</span>
            }
            {
              incompleteFields && incompleteFields.length === 0 &&
              <span>Form is completed</span>
            }
          </Col>

          <Col xs={3} sm={3} md={3}>
            <Button
              bsStyle="link"
              onClick={this.goback.bind(this)}
            >
              Cancel
            </Button>

            <Button
              bsStyle="primary"
              disabled={!loaded || saving }
              onClick={this.onSave.bind(this)}
            >
              { saving ? 'Saving ...' : 'Save' }
            </Button>
          </Col>
        </Row>

        <iframe
          src={`${config.forms.url}/embed/${this.props.params.form}?domain=${window.location.hostname}&access_token=${token}`}
          frameBorder="0"
          ref={ref => this.frame = ref}
        />

        <MessageModal
          show={this.state.showSuccessModal}
          text="Form saved"
        />
      </div>
    )
  }
}
