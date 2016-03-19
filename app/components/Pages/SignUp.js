// SignUp.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Alert, Col } from 'react-bootstrap'
import S from 'shorti'

// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../stores/AppStore'

// Partials
import BigHeading from '../Partials/BigHeading'

export default class SignUp extends Component {

  componentWillMount() {
    // Reset data store before mounting
    AppStore.data = {}
    AppStore.emitChange()
  }

  componentDidMount() {
    // Default to client
    AppStore.data.signup = {
      user_type: 'Client'
    }
    // Delay ?
    setTimeout(() => {
      AppStore.emitChange()
    }, 100)
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

    const first_name = this.refs.first_name.refs.input.value
    const last_name = this.refs.last_name.refs.input.value
    const email = this.refs.email.refs.input.value
    const password = this.refs.password.refs.input.value
    const confirm_password = this.refs.confirm_password.refs.input.value

    const data = this.props.data
    const user_type = data.signup.user_type

    // Random phone for now
    const random_phone = Math.floor(Math.random() * 1000000000)

    const user = {
      first_name,
      last_name,
      email,
      user_type,
      phone_number: random_phone,
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

    // If show message
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
    let main_content = (
      <div>
        <h1 className="tempo">Sign up</h1>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input bsStyle={ first_name_style } type="text" ref="first_name" placeholder="First Name"/>
          <Input bsStyle={ last_name_style } type="text" ref="last_name" placeholder="Last Name"/>
          <Input bsStyle={ email_style } type="text" ref="email" placeholder="Email"/>
          <Input bsStyle={ password_style } type="password" ref="password" placeholder="Password"/>
          <Input bsStyle={ password_style } type="password" ref="confirm_password" placeholder="Confirm Password"/>
          <div style={ S('mb-30 mt-20') }>
            <div>
              <h4>I am a</h4>
            </div>
            <Col xs={ 6 } style={ S('pl-0') }>
              <Button onClick={ this.handleUserTypeClick.bind(this, 'Client') } bsStyle={ data.signup && data.signup.user_type === 'Client' ? 'primary' : 'default' } style={ S('w-100p') }>
                Client
              </Button>
            </Col>
            <Col xs={ 6 } style={ S('pr-0') }>
              <Button onClick={ this.handleUserTypeClick.bind(this, 'Agent') }bsStyle={ data.signup && data.signup.user_type === 'Agent' ? 'primary' : 'default' } style={ S('w-100p') }>
                Agent
              </Button>
            </Col>
            <div className="clearfix"></div>
          </div>
          { message }
          <Button type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p mb-20') }>
            { submitting ? 'Signing up...' : 'Sign up' }
          </Button>
          <div style={ S('color-929292 font-13 mt-20') }>Already have an account? <Link to="/signin">Sign in</Link></div>
        </form>
      </div>
    )

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
          Success!  Your account was created.  You may now <Link to={ signin_link }>sign in</Link>.
        </Alert>
      )
    }
    return (
      <div id="main-content" className="flex-center-wrap" style={ S('absolute h-100p w-100p mt-20n') }>
        <div className="text-center center-block " style={ S('w-300') }>
          <BigHeading />
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