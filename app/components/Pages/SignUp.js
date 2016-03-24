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
    AppStore.emitChange()
  }
  handleUserTypeClick(user_type) {
    AppStore.data.signup = {
      user_type
    }
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
          <Alert bsStyle="warning">This email is already in our system.  You may try to <Link to="/signin">sign in</Link>.</Alert>
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
        <div style={ S('color-929292 font-13 mt-20') }>Already have an account? <Link to="/signin">Log in</Link></div>
      </div>
    )
    if (data.signup && data.signup.user_type === 'Agent') {
      main_content = (
        <div style={ S('p-50') }>
          <h1 style={ S('fw-100 mb-20') } className="tempo">Set Up Agent Profile</h1>
          <div style={ S('color-555555 mb-20 font-18 mb-20') }>
            Tell us your license number so we can<br />
            verify you’re a real agent.
          </div>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            <Input style={ input_style } bsSize="large" type="text" ref="agent_license" placeholder="Enter your agent license number"/>
            <Button bsSize="large" style={ S('w-100p bg-4c7dbf color-fff border-0-solid-fff') }>Find Me</Button>
            <div style={ S('color-929292 font-13 mt-20') }>Actually I'm a <a href="#" onClick={ this.handleUserTypeClick.bind(this, 'Client') }>Client</a></div>
          </form>
        </div>
      )
    }
    if (data.signup && data.signup.user_type === 'Client') {
      main_content = (
        <div style={ S('p-50') }>
          <h1 style={ S('fw-100 mb-20') } className="tempo">Set Up Client Profile</h1>
          <form onSubmit={ this.handleSubmit.bind(this) }>
            <Input style={ input_style } bsSize="large" bsStyle={ first_name_style } type="text" ref="first_name" placeholder="First Name"/>
            <Input style={ input_style } bsSize="large" bsStyle={ last_name_style } type="text" ref="last_name" placeholder="Last Name"/>
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
    /* Handle success
    ======================== */
    if (data.show_message && data.status === 'success') {
      // Signin link
      let signin_link = '/signin'
      const room_id = this.props.location.query.room_id
      const invite_token = this.props.location.query.invite_token
      if (room_id && invite_token)
        signin_link += '?message=invite-room&room_id=' + room_id + '&invite_token=' + invite_token

      main_content = (
        <Alert bsStyle="success">
          Success!  Your account was created.<br />
          You may now <Link to={ signin_link }>sign in</Link>.
        </Alert>
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