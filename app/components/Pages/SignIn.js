// SignIn.js
import React, { Component } from 'react'
import { Link, browserHistory } from 'react-router'
import { Button, FormControl, Alert, Modal } from 'react-bootstrap'
import S from 'shorti'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import helpers from '../../utils/helpers'
import Brand from '../../controllers/Brand'

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

  componentDidMount() {

    // this.refs.email.refs.input.focus()
    const message = helpers.getParameterByName('message')
    if (message && message === 'account-upgraded') {
      setTimeout(() => {
        AppStore.data.show_upgrade_confirm_modal = true
        AppStore.emitChange()
      }, 500)
    }
    if (message && message === 'phone-signup-success' || message && message === 'email-already-verified') {
      setTimeout(() => {
        AppStore.data.show_email_verified_modal = true
        AppStore.emitChange()
      }, 500)
    }
    const data = this.props.data
    if (data.location && data.location.query && data.location.query.email) {
      const email = decodeURIComponent(data.location.query.email)
      if (email && email !== 'undefined')
        this.emailInput.value = email
    }
  }

  componentDidUpdate() {
    // If sign in successful, redirect
    const data = this.props.data
    const user = data.user
    if (user) {
      this.initFullStory(user)
      let redirect_to = '/dashboard/mls'
      if (data.location.query && data.location.query.redirect_to)
        redirect_to = data.location.query.redirect_to

      browserHistory.push(redirect_to)
    }
  }

  hideModal() {
    delete AppStore.data.show_upgrade_confirm_modal
    delete AppStore.data.show_email_verified_modal
    AppStore.emitChange()
  }

  initFullStory(user) {
    // window.FS.identify(user.id, {
    //   displayName: user.first_name + ' ' + user.last_name,
    //   email: user.email
    // })
  }

  handleSubmit(e) {
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()

    const email = this.emailInput.value
    const password = this.passwordInput.value
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

  sendEmailVerification() {
    const data = this.props.data
    if (!data.email_not_confirmed)
      return
    const user = data.email_not_confirmed.user
    AppDispatcher.dispatch({
      action: 'send-verify-email',
      access_token: user.access_token
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
    if (data.location && data.location.query && data.location.query.email) {
      message = (
        <Alert bsStyle="warning">This email is already in use.  Please log in to continue.</Alert>
      )
    }
    if (data.show_message) {
      message = (
        <Alert bsStyle="danger">
          There was an error with this request. This email or password is incorrect.
        </Alert>
      )
      if (data.email_not_confirmed) {
        message = (
          <Alert bsStyle="danger">
            This email has not been verified yet.
            <div>
              <a href="#" onClick={ this.sendEmailVerification.bind(this) }>Send email verification again</a>.
              <div>{ data.verify_email_sent ? 'Email resent' : ''}</div>
            </div>
          </Alert>
        )
      }
    }
    let invite_message
    if (data.invite_room_message) {
      invite_message = (
        <Alert bsStyle="success">
          You have been invited to join a chatroom!  Log in or Sign up to complete the invite process.
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
          <h1 className="tempo" style={ S('mb-20') }>Log in to { Brand.message('site_title', 'Rechat') }</h1>
          <div style={ S('color-555555 mb-20 font-18 mb-20') }>It’s nice to have you back!</div>
          { invite_message }
          <form action="/signin" onSubmit={ this.handleSubmit.bind(this) }>
            <FormControl bsSize="large" style={ input_style } bsStyle={ email_style } type="text" inputRef={ ref => this.emailInput = ref } placeholder="Email"/>
            <FormControl bsSize="large" style={ input_style } bsStyle={ password_style } type={ data.signin && data.signin.password_is_visible ? 'text' : 'password' } inputRef={ ref => this.passwordInput = ref } placeholder="Password"/>
            <div style={ S('color-929292 font-13 mt-0 mb-10') } className="pull-right"><Link to="/password/forgot">Forgot Password</Link></div>
            <div className="clearfix"></div>
            { message }
            <Button
              bsSize="large"
              type="submit"
              className={ submitting_class + 'btn' }
              disabled={ submitting }
              style={ S('w-100p mb-20 border-none color-fff bg-' + Brand.color('primary', '3388ff')) }
            >
              { submitting ? 'Logging in...' : 'Log in' }
            </Button>
            {
              /*
              <div style={ S('color-929292 font-13') }>Don’t have a Rechat account?&nbsp;&nbsp;<Link to={ signup_link }>Try it free</Link>.</div>
              */
            }
          </form>
          <div style={ S('mt-10 font-14 color-929292') }>
            Don't have an account?&nbsp;&nbsp;<a href="/signup">Sign up</a>.
          </div>
        </div>
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_upgrade_confirm_modal } onHide={ this.hideModal }>
          <Modal.Body className="text-center">
            <div style={ S('mb-20 mt-20') }>
              <div style={ S('br-100 w-90 h-90 center-block bg-3388ff text-center') }>
                <i style={ S('color-fff font-40 mt-25') } className="fa fa-check"></i>
              </div>
            </div>
            <div style={ S('font-24 mb-20') }>Account Upgraded</div>
            <div style={ S('font-18 mb-20') }>You may now log in and use enhanced features.</div>
            <Button style={ S('mb-20') } bsStyle="primary" onClick={ this.hideModal.bind(this) }>Ok</Button>
          </Modal.Body>
        </Modal>
        <Modal dialogClassName={ data.is_mobile ? 'modal-mobile' : '' } show={ data.show_email_verified_modal } onHide={ this.hideModal }>
          <Modal.Body className="text-center">
            <div style={ S('mb-20 mt-20') }>
              <div style={ S('br-100 w-90 h-90 center-block bg-3388ff text-center') }>
                <i style={ S('color-fff font-40 mt-25') } className="fa fa-check"></i>
              </div>
            </div>
            <div style={ S('font-24 mb-20') }>Email Verified</div>
            <div style={ S('font-18 mb-20') }>You may now log in.</div>
            <Button style={ S('mb-20') } bsStyle="primary" onClick={ this.hideModal.bind(this) }>Ok</Button>
          </Modal.Body>
        </Modal>
      </div>
    )
  }
}

// PropTypes
SignIn.propTypes = {
  data: React.PropTypes.object,
  location: React.PropTypes.object.isRequired
}
