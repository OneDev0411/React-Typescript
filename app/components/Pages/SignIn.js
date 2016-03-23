// SignIn.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Alert } from 'react-bootstrap'
import S from 'shorti'
import config from '../../../config/public'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import io from 'socket.io-client'

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
      const socket = io(config.socket.server)
      socket.emit('Room.UserOnline', user.id)
      let redirect_to = '/dashboard/recents'
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
      ...S('border-bottom-1-solid-929292 br-0')
    }

    // Signup link
    let signup_link = '/signup'
    const room_id = this.props.location.query.room_id
    const invite_token = this.props.location.query.invite_token
    if (room_id && invite_token)
      signup_link += '?message=invite-room&room_id=' + room_id + '&invite_token=' + invite_token
    const video = (
      <video style={ S('z-0 fixed w-100p h-100p') } autoPlay="true" loop="true" className="fullscreen-bg__video">
        <source src={'/videos/landing/young_agent.webm'} type="video/webm"/>
        <source src={'/videos/landing/young_agent.mp4'} type="video/mp4"/>
        <source src={'/videos/landing/young_agent.ogv'} type="video/ogg"/>
      </video>
    )
    return (
      <div id="main-content" className="flex-center-wrap page-bg-video" style={ S('absolute h-100p w-100p mt-60n') }>
        <div className="overlay"></div>
        { video }
        <div className="text-center center-block" style={ S('w-300 z-100') }>
          <h1 className="tempo" style={ S('mb-20') }>Log in</h1>
          <div style={ S('color-929292 mb-20') }>Let the good times roll</div>
          { invite_message }
          <form action="/signin" onSubmit={ this.handleSubmit.bind(this) }>
            <Input style={ input_style } bsStyle={ email_style } type="text" ref="email" placeholder="Email"/>
            <Input style={ input_style } bsStyle={ password_style } type="password" ref="password" placeholder="Password"/>
            <div style={ S('color-929292 font-13 mt-0 mb-10') } className="pull-right"><Link to="/password/forgot">Forgot Password</Link></div>
            <div className="clearfix"></div>
            { message }
            <Button type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p mb-20') }>
              { submitting ? 'Signing in...' : 'Sign in' }
            </Button>
            <div style={ S('color-929292 font-13') }>Don't have an account yet? <Link to={ signup_link }>Sign up</Link></div>
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