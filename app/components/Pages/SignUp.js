// SignUp.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Alert } from 'react-bootstrap'
import S from 'shorti'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import AppStore from '../../stores/AppStore'
import MapBackground from '../Partials/MapBackground'
export default class SignUp extends Component {
  componentWillMount() {
    // Reset data store before mounting
    AppStore.data = {}
    AppStore.data.signup = {}
    AppStore.emitChange()
    // Grab connect code
    if (this.props.location.query.connect) {
      const connect = this.props.location.query.connect
      AppStore.data.signup.connect = connect
      AppStore.emitChange()
    }
  }
  handleUserTypeClick(user_type) {
    AppStore.data.signup.user_type = user_type
    AppStore.emitChange()
  }
  searchAgent(e) {
    e.preventDefault()
    const mlsid = this.refs.mlsid.refs.input.value.trim()
    delete AppStore.data.errors
    delete AppStore.data.error_type
    delete AppStore.data.show_message
    AppStore.data.submitting = true
    AppStore.emitChange()
    if (mlsid) {
      AppDispatcher.dispatch({
        action: 'search-agent',
        mlsid
      })
    }
  }
  handleAgentChange(type) {
    AppStore.data.signup.agent[type] = this.refs[type].refs.input.value
    AppStore.emitChange()
  }
  handleSubmit(e) {
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()
    const first_name = this.refs.first_name.refs.input.value.trim()
    const last_name = this.refs.last_name.refs.input.value.trim()
    const email = this.refs.email.refs.input.value.trim()
    const password = this.refs.password.refs.input.value.trim()
    const confirm_password = this.refs.confirm_password.refs.input.value.trim()
    const data = this.props.data
    const user_type = data.signup.user_type
    if (!first_name) {
      AppStore.data.error_type = 'first_name'
      this.refs.first_name.refs.input.focus()
      AppStore.data.errors = true
      AppStore.data.show_message = true
      delete AppStore.data.submitting
      AppStore.emitChange()
      return
    }
    if (!last_name) {
      AppStore.data.error_type = 'last_name'
      this.refs.last_name.refs.input.focus()
      AppStore.data.errors = true
      AppStore.data.show_message = true
      delete AppStore.data.submitting
      AppStore.emitChange()
      return
    }
    if (!email) {
      AppStore.data.error_type = 'email'
      this.refs.email.refs.input.focus()
      AppStore.data.errors = true
      AppStore.data.show_message = true
      delete AppStore.data.submitting
      AppStore.emitChange()
      return
    }
    if (!password) {
      AppStore.data.error_type = 'password'
      AppStore.data.errors = true
      AppStore.data.show_message = true
      this.refs.password.refs.input.focus()
      delete AppStore.data.submitting
      AppStore.emitChange()
      return
    }
    const user = {
      first_name,
      last_name,
      email,
      user_type,
      grant_type: 'password'
    }
    AppDispatcher.dispatch({
      action: 'sign-up',
      user,
      password,
      confirm_password,
      redirect_to: ''
    })
  }
  render() {
    // Data
    const data = this.props.data
    let message
    let email_style
    let password_style
    let first_name_style
    let last_name_style
    /* Handle erros
    ======================== */
    const errors = data.errors
    if (data.show_message && errors) {
      if (data.error_type === 'first_name') {
        first_name_style = 'error'
        message = (
          <Alert bsStyle="danger">You must add a first name.</Alert>
        )
      }
      if (data.error_type === 'last_name') {
        last_name_style = 'error'
        message = (
          <Alert bsStyle="danger">You must add a last name.</Alert>
        )
      }
      if (data.error_type === 'email') {
        email_style = 'error'
        message = (
          <Alert bsStyle="danger">This email is invalid.</Alert>
        )
      }
      if (data.error_type === 'password') {
        const password_error = data.password_error
        password_style = 'error'
        if (data.password_error === 'no-match') {
          message = (
            <Alert bsStyle="danger">Your password and confirm password must match.</Alert>
          )
        }
        if (password_error === 'too-short') {
          message = (
            <Alert bsStyle="danger">Your password must be at least 6 characters long.</Alert>
          )
        }
      }
      if (data.error_type === 'server' && data.response === 'email-in-use') {
        email_style = 'error'
        message = (
          <Alert bsStyle="warning">This email is already in our system.<br />You may try to <Link to="/signin">log in</Link>.</Alert>
        )
      }
      if (data.error_type === 'agent-not-found') {
        message = (
          <Alert bsStyle="danger" style={ S('mt-20') }>Agent not found.</Alert>
        )
      }
    }
    // Style
    const submitting = data.submitting
    let submitting_class
    if (submitting)
      submitting_class = 'disabled'
    const input_style = {
      border: 'none',
      ...S('border-bottom-1-solid-ccc br-0 p-0')
    }
    // Initial
    let main_content = (
      <div style={ S('p-20') }>
        <h1 style={ S('fw-100 mb-20') } className="tempo">Let's Set Up Your Account</h1>
        <div style={ S('color-555555 mb-20 font-18 mb-30') }>Which best describes you?</div>
        <div style={ S('mb-10 pl-30 pr-30') }>
          <Button onClick={ this.handleUserTypeClick.bind(this, 'Agent') } bsSize="large" style={ S('w-100p') } bsStyle="primary">I'm an Agent</Button>
        </div>
        <div style={ S('mb-10 pl-30 pr-30') }>
          <Button onClick={ this.handleUserTypeClick.bind(this, 'Client') } bsSize="large" style={ S('w-100p bg-4c7dbf color-fff border-0-solid-fff') }>I'm a Client</Button>
        </div>
        <div style={ S('mb-10 pl-30 pr-30') }>
          { message }
        </div>
        <div style={ S('color-929292 font-13 mt-20') }>Already have an account? <Link to="/signin">Log in</Link></div>
      </div>
    )
    // Search agent
    if (data.signup && data.signup.user_type === 'Agent') {
      main_content = (
        <div style={ S('p-50') }>
          <h1 style={ S('fw-100 mb-20') } className="tempo">Set Up Agent Profile</h1>
          <div style={ S('color-555555 mb-20 font-18 mb-20') }>
            Tell us your license number so we can<br />
            verify you’re a real agent.
          </div>
          <form onSubmit={ this.searchAgent.bind(this) }>
            <Input style={ input_style } bsSize="large" type="text" ref="mlsid" placeholder="Enter your agent license number"/>
            <Button className={ submitting_class } type="submit" bsSize="large" style={ S('w-100p bg-4c7dbf color-fff border-0-solid-fff') }>
              { submitting ? 'Searching...' : 'Find Me' }
            </Button>
            { message }
            <div style={ S('color-929292 font-13 mt-20') }>Actually I'm a <a href="#" onClick={ this.handleUserTypeClick.bind(this, 'Client') }>Client</a></div>
          </form>
        </div>
      )
    }
    // Signup as client
    if (data.signup && data.signup.user_type === 'Client') {
      main_content = (
        <div style={ S('p-50') }>
          <h1 style={ S('fw-100 mb-20') } className="tempo">Set Up Client Profile</h1>
          <div style={ S('color-555555 mb-20 font-18 mb-20') }>Almost there. Just one more quick step.</div>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            <div>
              <div style={ S('w-50p pull-left relative') }>
                <Input style={ input_style } bsSize="large" bsStyle={ first_name_style } type="text" ref="first_name" placeholder="First Name"/>
                <div style={ S('absolute r-10 t-12 h-20 w-1 bg-ccc') }></div>
              </div>
              <div style={ S('w-50p pull-left') }>
                <Input style={ input_style } bsSize="large" bsStyle={ last_name_style } type="text" ref="last_name" placeholder="Last Name"/>
              </div>
            </div>
            <Input style={ input_style } bsSize="large" bsStyle={ email_style } type="text" ref="email" placeholder="Email"/>
            <Input style={ input_style } bsSize="large" bsStyle={ password_style } type="password" ref="password" placeholder="Password"/>
            <Input style={ input_style } bsSize="large" bsStyle={ password_style } type="password" ref="confirm_password" placeholder="Confirm Password"/>
            { message }
            <Button bsSize="large" type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p mb-20 mt-20') }>
              { submitting ? 'Signing up...' : 'Sign up' }
            </Button>
            <div style={ S('color-929292 font-13 mt-20') }>Already have an account? <Link to="/signin">Log in</Link></div>
          </form>
        </div>
      )
    }
    // Signup as agent
    if (data.signup && data.signup.user_type === 'Agent' && data.signup.agent) {
      const agent = data.signup.agent
      main_content = (
        <div style={ S('pt-50') }>
          <h1 style={ S('fw-100 mb-20') } className="tempo">Set Up Your Agent Profile</h1>
          <div style={ S('pl-50 pb-50 pr-50') }>
            <div style={ S('color-555555 mb-20 font-18 mb-20') }>Almost there. Just one more quick step.</div>
            <form onSubmit={ this.handleSubmit.bind(this) }>
              <div>
                <div style={ S('w-50p pull-left relative') }>
                  <Input value={ agent.first_name } onChange={ this.handleAgentChange.bind(this, 'first_name') } style={ input_style } bsSize="large" bsStyle={ first_name_style } type="text" ref="first_name" placeholder="First Name"/>
                  <div style={ S('absolute r-10 t-12 h-20 w-1 bg-ccc') }></div>
                </div>
                <div style={ S('w-50p pull-left') }>
                  <Input value={ agent.last_name } onChange={ this.handleAgentChange.bind(this, 'last_name') } style={ input_style } bsSize="large" bsStyle={ last_name_style } type="text" ref="last_name" placeholder="Last Name"/>
                </div>
              </div>
              <Input readOnly style={ input_style } bsSize="large" bsStyle={ email_style } type="text" ref="email" placeholder="Email" value={ agent.email }/>
              <Input style={ input_style } bsSize="large" bsStyle={ password_style } type="password" ref="password" placeholder="Password"/>
              <Input style={ input_style } bsSize="large" bsStyle={ password_style } type="password" ref="confirm_password" placeholder="Confirm Password"/>
              { message }
              <Button bsSize="large" type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p mb-20 mt-20') }>
                { submitting ? 'Signing up...' : 'Sign up' }
              </Button>
              <div style={ S('color-929292 font-13 mt-20') }>Already have an account? <Link to="/signin">Log in</Link></div>
            </form>
          </div>
        </div>
      )
    }
    // Email verification message
    if (data.signup && data.signup.email_verify_message) {
      main_content = (
        <div style={ S('p-50') }>
          <div style={ S('font-20') }>All set, Sam! We’ll need to verify your email to make sure it’s you.</div>
        </div>
      )
    }
    /* Handle success
    ======================== */
    if (data.show_message && data.status === 'success') {
      // Old deep link
      // let signin_link = '/signin'
      // const room_id = this.props.location.query.room_id
      // const invite_token = this.props.location.query.invite_token
      // if (room_id && invite_token)
      //   signin_link += '?message=invite-room&room_id=' + room_id + '&invite_token=' + invite_token
      main_content = (
        <div style={ S('p-50') }>
          <div style={ S('mb-30') }>
            <img style={ S('w-105 h-101') } src="/images/signup/mail.png" />
          </div>
          <div style={ S('font-20 mb-20') }>All set, { data.new_user ? data.new_user.first_name : '' }! We’ll need to verify your<br /> email to make sure it’s you.</div>
          <div style={ S('font-14') }>We sent you an email with your verification link. Please check your email: <span className="text-primary">{ data.new_user ? data.new_user.email : '' }</span></div>
        </div>
      )
    }
    return (
      <div id="main-content" className="flex-center-wrap" style={ S('absolute h-100p w-100p') }>
        <MapBackground />
        <div className="text-center center-block modal-shadow" style={ S('w-460 z-100 relative mt-60n bg-fff br-6') }>
          { main_content }
        </div>
      </div>
    )
  }
}

// PropTypes
SignUp.propTypes = {
  data: React.PropTypes.object,
  location: React.PropTypes.object.isRequired
}