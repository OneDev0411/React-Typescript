// SignIn.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Alert } from 'react-bootstrap'
import S from 'shorti'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'
// import MapBackground from '../Partials/MapBackground'

export default class SignIn extends Component {

  componentWillMount() {
    // Reset data store before mounting
    AppStore.data = {}
    AppStore.emitChange()
    if (this.props.location.query.message === 'invite-room') {
      AppStore.data.invite_room_message = true
      AppStore.emitChange()
    }
  }

  componentDidUpdate() {
    // If sign in successful, redirect
    const data = this.props.data
    const user = data.user
    if (user) {
      let redirect_to = '/dashboard/mls'
      if (data.location.query && data.location.query.redirect_to)
        redirect_to = data.location.query.redirect_to
      this.props.history.pushState(null, redirect_to)
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()

    const email = this.refs.email.refs.input.value
    const password = this.refs.password.refs.input.value
    let invite
    if (this.props.location.query.message === 'invite-room') {
      invite = {
        room_id: this.props.location.query.room_id,
        invite_token: this.props.location.query.invite_token
      }
    }
    AppDispatcher.dispatch({
      action: 'sign-in',
      email,
      password,
      redirect_to: '/dashboard/recents', // change to referrer
      invite
    })
  }

  render() {
    // Data
    const data = this.props.data
    data.invite_room_message = AppStore.data.invite_room_message

    // Validation
    const errors = data.errors
    const validation = data.validation
    let email_style
    let password_style
    if (errors && validation && !validation.email)
      email_style = 'error'

    if (errors && validation && !validation.password)
      password_style = 'error'

    const submitting = data.submitting
    let submitting_class = ''
    if (submitting)
      submitting_class = 'disabled'

    let message
    if (data.show_message) {
      message = (
        <Alert bsStyle="danger">
          There was an error with this request.
        </Alert>
      )
      if (data.email_not_confirmed) {
        message = (
          <Alert bsStyle="danger">
            This email has not been verified yet.
          </Alert>
        )
      }
    }

    let invite_message
    if (data.invite_room_message) {
      invite_message = (
        <Alert bsStyle="success">
          You have been invited to join a chatroom!  Sign in or Sign up to complete the invite process.
        </Alert>
      )
    }
    const input_style = {
      border: 'none',
      ...S('border-bottom-1-solid-ccc br-0 p-0')
    }
    // Signup link
    let signup_link = '/signup'
    const room_id = this.props.location.query.room_id
    const invite_token = this.props.location.query.invite_token
    if (room_id && invite_token)
      signup_link += '?message=invite-room&room_id=' + room_id + '&invite_token=' + invite_token
    return (
      <div id="main-content" className="flex-center-wrap page-bg-video" style={ S('absolute h-100p w-100p') }>
        <div className="text-center center-block box-shadow" style={ S('w-460 z-100 relative mt-60n bg-fff br-6 p-50') }>
          <h1 className="tempo" style={ S('mb-20') }>Log in to Rechat</h1>
          <div style={ S('color-555555 mb-20 font-18 mb-20') }>It’s nice to have you back!</div>
          { invite_message }
          <form action="/signin" onSubmit={ this.handleSubmit.bind(this) }>
            <Input bsSize="large" style={ input_style } bsStyle={ email_style } type="text" ref="email" placeholder="Email"/>
            <Input bsSize="large" style={ input_style } bsStyle={ password_style } type={ data.signin && data.signin.password_is_visible ? 'text' : 'password' } ref="password" placeholder="Password"/>
            <div style={ S('color-929292 font-13 mt-0 mb-10') } className="pull-right"><Link to="/password/forgot">Forgot Password</Link></div>
            <div className="clearfix"></div>
            { message }
            <Button bsSize="large" type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p mb-20') }>
              { submitting ? 'Signing in...' : 'Sign in' }
            </Button>
            {
              /*
              <div style={ S('color-929292 font-13') }>Don’t have a Rechat account?&nbsp;&nbsp;<Link to={ signup_link }>Try it free</Link>.</div>
              */
            }
          </form>
        </div>
      </div>
    )
  }
}

// PropTypes
SignIn.propTypes = {
  data: React.PropTypes.object,
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}