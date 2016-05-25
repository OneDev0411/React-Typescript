// SignUp.js
import React, { Component } from 'react'
import { Col, Button, Input, Popover, OverlayTrigger } from 'react-bootstrap'
import S from 'shorti'
import validator from 'validator'
import { randomString } from '../../utils/helpers'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import AppStore from '../../stores/AppStore'
import CheckEmailModal from '../Partials/CheckEmailModal'
export default class SignUp extends Component {
  componentWillMount() {
    // Reset data store before mounting
    AppStore.data = {}
    AppStore.data.signup = {}
    // Grab inviting_user code
    if (this.props.location.query.inviting_user) {
      const inviting_user = this.props.location.query.inviting_user
      AppStore.data.signup.inviting_user = inviting_user
    }
    if (this.props.location.query.phone_number) {
      const phone_number = this.props.location.query.phone_number
      AppStore.data.signup.phone_number = phone_number
    }
    if (this.props.location.query.room) {
      const room = this.props.location.query.room
      AppStore.data.signup.room = room
    }
    AppStore.emitChange()
  }
  componentDidMount() {
    this.refs.email.refs.input.focus()
  }
  showIntercom() {
    window.Intercom('show')
  }
  setSignupEmail(e) {
    const email = e.target.value
    AppStore.data.signup.email = email
    AppStore.emitChange()
  }
  handleEmailSubmit(e) {
    // If clicked
    setTimeout(() => {
      this.refs.email.refs.input.focus()
    }, 100)
    e.preventDefault()
    delete AppStore.data.errors
    AppStore.emitChange()
    const data = this.props.data
    const signup = data.signup
    if (!signup)
      return
    const email = signup.email
    // If no email or double submit
    if (!email || data.submitting)
      return
    const random_password = randomString(9)
    if (!email.trim())
      return
    if (!validator.isEmail(email)) {
      AppStore.data.errors = {
        type: 'email-invalid'
      }
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.errors
        AppStore.emitChange()
      }, 3000)
      return
    }
    AppStore.data.submitting = true
    AppStore.emitChange()
    const user = {
      first_name: email,
      email,
      user_type: 'Client',
      password: random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  }
  resend() {
    const data = this.props.data
    const new_user = data.new_user
    const user = {
      first_name: new_user.email,
      email: new_user.email,
      user_type: 'Client',
      password: new_user.random_password,
      grant_type: 'password',
      is_shadow: true
    }
    AppStore.data.resent_email_confirmation = true
    AppDispatcher.dispatch({
      action: 'sign-up-shadow',
      user,
      redirect_to: ''
    })
  }
  hideModal() {
    delete AppStore.data.show_signup_confirm_modal
    AppStore.emitChange()
  }
  render() {
    // Data
    const data = this.props.data
    let signup_input_style = {
      ...S('h-52 w-260 font-16 bg-fafbfc border-1-solid-dfe6ee'),
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0
    }
    const signup_btn_style = {
      ...S('h-52 w-180 font-16'),
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    }
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      signup_input_style = {
        ...signup_input_style,
        width: window.innerWidth - 215
      }
    }
    let popover = <Popover id="popover" className="hidden" />
    if (data.errors) {
      if (data.errors.type === 'email-invalid') {
        popover = (
          <Popover id="popover" title="">You must enter a valid email</Popover>
        )
      }
      if (data.errors.type === 'email-in-use') {
        popover = (
          <Popover id="popover" title="">This email is already in use.  Follow the <a href="/password/forgot">forgot password process</a> or <a href="#" onClick={ this.showIntercom }>contact support</a>.</Popover>
        )
      }
      if (data.errors.type === 'bad-request') {
        popover = (
          <Popover id="popover" title="">Bad request.</Popover>
        )
      }
    }
    const main_content = (
      <div style={ S('pt-50') }>
        <Col xs={ 12 }>
          <div style={ S('text-center') }>
            <div className="din" style={ S('font-30 color-263445 mb-10') }>Hello, lets get started.</div>
            <div style={ S('border-bottom-2-solid-d8d8d8 mb-20 w-50 center-block') }></div>
            <form onSubmit={ this.handleEmailSubmit.bind(this) }>
              <div style={ S('pull-left') }>
                <OverlayTrigger trigger="focus" placement="bottom" overlay={ popover }>
                  <Input ref="email" onChange={ this.setSignupEmail } style={ signup_input_style } type="text" placeholder="Enter email address" value={ data.signup_email } />
                </OverlayTrigger>
              </div>
              <div style={ S('pull-left') }>
                <Button className={ data.submitting ? 'disabled' : '' } bsStyle="primary" style={ signup_btn_style } type="submit">{ data.submitting ? 'Submitting...' : 'Lets go' }</Button>
              </div>
            </form>
          </div>
          <div className="clearfix"></div>
          <div style={ S('mt-10 font-14 color-929292') }>
            Already have an account?&nbsp;&nbsp;<a href="/signin">Log in</a>.
          </div>
        </Col>
      </div>
    )
    return (
      <div id="main-content" className="flex-center-wrap" style={ S('absolute h-100p w-100p') }>
        <div className="text-center center-block" style={ S('w-100p maxw-470 z-100 relative mt-60n bg-fff br-6') }>
          { main_content }
        </div>
        <CheckEmailModal
          data={ data }
          hideModal={ this.hideModal }
          showIntercom={ this.showIntercom }
          resend={ this.resend }
        />
      </div>
    )
  }
}

// PropTypes
SignUp.propTypes = {
  data: React.PropTypes.object,
  location: React.PropTypes.object.isRequired
}