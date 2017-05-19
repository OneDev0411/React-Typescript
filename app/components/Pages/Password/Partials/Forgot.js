// Forgot.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { FormControl, Button, Col, Alert } from 'react-bootstrap'
import S from 'shorti'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Forgot extends Component {
  componentDidMount() {
    this.emailInput.focus()
  }

  handleSubmit(e) {
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()

    const formData = {
      email: this.emailInput.value
    }
    this.props.handleSubmit('forgot-password', formData)
  }

  handleSendVerificationAgain() {
    this.props.handleSendVerificationAgain()
  }

  render() {
    const { data } = this.props
    const errors = data.errors

    let email_style
    let message
    let message_text
    let alert_style

    if (data.show_message) {
      // Errors
      if (errors) {
        if (data.email_not_found) {
          email_style = 'error'
          alert_style = 'warning'
          message_text = (
            <div>Sorry, that email address is not registered with us.<br /> Please try again or <Link to="/signup">register for a new account</Link>.</div>
          )
        }

        if (data.email_invalid) {
          email_style = 'error'
          alert_style = 'danger'
          message_text = 'Oops! That looks like an invalid email address!'
        }
      } // errors

      // Success
      if (data.status === 'success') {
        alert_style = 'success'
        const forgot_password = data.forgot_password
        let resend
        if (forgot_password)
          resend = forgot_password.resend
        let resend_message
        if (resend) {
          resend_message = (
            <div>We've sent you instructions again.</div>
          )
        }
        message_text = (
          <div>
            We've sent you an email with instructions on how to reset your password.  Please check <span className="text-primary">{ forgot_password.email }</span>.<br />
            <a href="#" onClick={this.handleSendVerificationAgain.bind(this)}>Send email verification again</a>.
            { resend_message }
          </div>
        )
      }

      if (message_text) {
        message = (
          <Alert bsStyle={alert_style}>
            { message_text }
          </Alert>
        )
      } // if
    }

    const { submitting } = data
    let submitting_class = ''
    if (submitting)
      submitting_class = 'disabled'

    const input_style = {
      border: 'none',
      ...S('border-bottom-1-solid-ccc br-0 p-0 mb-40 pl-10')
    }

    let main_content = (
      <div>
        <div style={S('color-929292 mb-40')}>Forgot your password?</div>

        <form onSubmit={this.handleSubmit.bind(this)}>
          <FormControl bsSize="large" style={input_style} bsStyle={email_style} inputRef={node => this.emailInput = node} placeholder="Email address" type="text" />

          { message }

          <Col sm={4} className="forgot__password-btn--cancel" style={S('p-0 pr-10')}>
            <Link className="btn btn-link" style={S('w-100p mt-5')} to="/signin">Cancel</Link>
          </Col>

          <Col sm={8} style={S('p-0')}>
            <Button bsSize="large" type="submit" className={`${submitting_class}btn btn-primary`} disabled={submitting} style={S('w-100p')}>
              { submitting ? 'Submitting...' : 'Reset Password' }
            </Button>
          </Col>

          <div className="clearfix" />

          <div style={S('mt-20 color-929292 font-13')}>
            <span>Change your mind? </span>
            <Link to="/signin">Log in</Link>
          </div>
        </form>

      </div>
    )

    if (data.status === 'success') {
      main_content = (
        <div>
          { message }
          <Link style={S('w-100p')} className="btn btn-primary" to="/">Done</Link>
        </div>
      )
    }

    return (
      <div className="center-block text-center box-shadow" style={S('w-460 p-50 br-6')}>
        <h1 className="tempo">Rechat</h1>
        { main_content }
      </div>
    )
  }
}

// PropTypes
Forgot.propTypes = {
  data: React.PropTypes.object,
  handleSubmit: React.PropTypes.func.isRequired,
  handleSendVerificationAgain: React.PropTypes.func
}
