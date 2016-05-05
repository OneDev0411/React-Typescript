// Reset.js
import React, { Component } from 'react'
import { Input, Button, Col, Alert } from 'react-bootstrap'
import S from 'shorti'
// AppStore
import AppDispatcher from '../../../dispatcher/AppDispatcher'
import AppStore from '../../../stores/AppStore'
export default class ConfirmAgent extends Component {
  componentDidUpdate() {
    const data = this.props.data
    const signup = data.signup
    // Redirect after agent confirmation
    if (signup && signup.is_agent)
      window.location.href = '/dashboard/mls?message=welcome'
  }
  showIntercom(e) {
    e.preventDefault()
    window.Intercom('show')
  }
  handleSubmit(type, e) {
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()
    if (type === 'search-agent')
      this.searchAgent()
    if (type === 'confirm-agent')
      this.confirmAgent()
  }
  searchAgent() {
    const mlsid = this.refs.mlsid.refs.input.value.trim()
    AppDispatcher.dispatch({
      action: 'search-agent-signup',
      mlsid
    })
  }
  confirmAgent() {
    const data = this.props.data
    const user = data.user
    const secret = this.refs.secret.refs.input.value.trim()
    const agent = data.signup.agent.id
    AppDispatcher.dispatch({
      action: 'upgrade-account',
      user,
      agent,
      secret
    })
  }
  render() {
    const data = this.props.data
    const errors = data.errors
    const submitting = data.submitting
    let submitting_class = ''
    if (submitting)
      submitting_class = 'disabled'
    // Errors
    let message
    if (errors) {
      message = (
        <Alert bsStyle="danger">
          Agent info not validated.
        </Alert>
      )
    }
    // Get agent
    let agent
    if (data.signup && data.signup.agent)
      agent = data.signup.agent
    // Search agent
    const brand_style = {
      ...S('color-cecdcd mb-20 font-26 text-left'),
      letterSpacing: '1.5px'
    }
    let main_content = (
      <div>
        <Col sm={ 5 } className={ data.is_mobile ? 'hidden' : '' }>
          <img style={ S('w-100p maxw-300') } src="/images/signup/ntreis-logo.png" />
        </Col>
        <Col sm={ 7 }>
          <div className="tk-calluna-sans" style={ brand_style }>Rechat</div>
          <div style={ S('color-000 mb-20 text-left font-36') }>Confirm agent status</div>
          <div style={ S('mb-20 color-9b9b9b') }>Enter your agent license # to unlock MLS features.</div>
          <form onSubmit={ this.handleSubmit.bind(this, 'search-agent') }>
            <div style={ S('w-100p mb-10') }>
              <Input bsSize="large" type="text" ref="mlsid" placeholder="Your agent number"/>
              <div className="clearfix"></div>
            </div>
            <Button bsSize="large" type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p') }>
              { submitting ? 'Submitting...' : 'Continue to Final Step' }
            </Button>
            <div style={ S('text-center mt-20') }>
              <a href="/dashboard/mls">I'll do this later</a>
            </div>
            <div style={ S('text-center mt-20') }>
              Having trouble? <a href="#" onClick={ this.showIntercom }>Contact support</a>.
            </div>
          </form>
        </Col>
      </div>
    )
    // Confirm agent
    if (agent) {
      main_content = (
        <div>
          <Col sm={ 5 } className={ data.is_mobile ? 'hidden' : '' }>
            <img style={ S('w-100p maxw-300') } src="/images/signup/agent-face.png" />
          </Col>
          <Col sm={ 7 }>
            <div className="tk-calluna-sans" style={ S('color-cecdcd mb-20 font-26 text-left') }>Rechat</div>
            <div style={ S('color-000 mb-20 text-left font-26') }>Confirm agent status</div>
            <div style={ S('mb-20 color-9b9b9b') }>We found the following contact details associated with agent license <strong>#{ data.signup.agent.mlsid }</strong></div>
            <div style={ S('mb-10 color-9b9b9b') }>Confirm this is you by entering your email or phone number # below</div>
            <div style={ S('mb-20 color-4a4a4a') }>
              {
                agent.secret_questions.map((question, i) => {
                  return (
                    <div key={ 'question-' + i } style={ S('fw-600') }>{ question }</div>
                  )
                })
              }
            </div>
            <form onSubmit={ this.handleSubmit.bind(this, 'confirm-agent') }>
              <div style={ S('w-100p mb-10') }>
                <Input type="text" ref="secret" placeholder="Your email or phone #"/>
                <div className="clearfix"></div>
                { message }
              </div>
              <Button type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p') }>
                { submitting ? 'Submitting...' : 'Confirm I\'m an agent' }
              </Button>
              <div style={ S('text-center mt-20') }>
                <a href="/dashboard/mls">I'll do this later</a>
              </div>
              <div style={ S('text-center mt-20') }>
                Having trouble? <a href="#" onClick={ this.showIntercom }>Contact support</a>.
              </div>
            </form>
          </Col>
        </div>
      )
    }
    let module_style = S('w-100p maxw-950')
    if (data.is_mobile)
      module_style = S('w-100p')
    return (
      <div id="main-content" className="flex-center-wrap" style={ S('absolute h-100p w-100p') }>
        <div style={ module_style }>
          { main_content }
        </div>
      </div>
    )
  }
}
// PropTypes
ConfirmAgent.propTypes = {
  data: React.PropTypes.object,
  history: React.PropTypes.object.isRequired
}