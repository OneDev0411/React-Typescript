// SignIn.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Alert } from 'react-bootstrap'
import S from 'shorti'
import config from '../../../config/public'

// AppStore
import AppStore from '../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

// Partials
import BigHeading from '../Partials/BigHeading'

// Socket.io
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
    const user = this.props.data.user
    if (user) {
      const socket = io(config.socket.server)
      socket.emit('Room.UserOnline', user.id)
      this.props.history.pushState(null, '/dashboard/recents')
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

    // Signup link
    let signup_link = '/signup'
    const room_id = this.props.location.query.room_id
    const invite_token = this.props.location.query.invite_token
    if (room_id && invite_token)
      signup_link += '?message=invite-room&room_id=' + room_id + '&invite_token=' + invite_token

    return (
      <div id="main-content" className="container">
        <div className="text-center center-block" style={ S('maxw-300') }>
          <BigHeading />
          <div style={ S('color-929292 mb-20') }>Sign in</div>
          { invite_message }
          <form action="/signin" onSubmit={ this.handleSubmit.bind(this) }>
            <Input bsStyle={ email_style } type="text" ref="email" placeholder="Email"/>
            <Input bsStyle={ password_style } type="password" ref="password" placeholder="Password"/>
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