// Forgot.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Input, Button, Col, Alert } from 'react-bootstrap'
import S from 'shorti'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Forgot extends Component {

  handleSubmit(e) {
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()

    const email = this.refs.email.getInputDOMNode().value
    const form_data = {
      email
    }

    this.props.handleSubmit('forgot-password', form_data)
  }

  render() {
    const data = this.props.data
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
            <div>Sorry, that email address is not registered with us.<br/> <Link to="/">Please try again or register for a new account</Link>.</div>
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
        message_text = `We've sent you an email with instructions on how to reset your password.  Please check your email.`
      }

      if (message_text) {
        message = (
          <Alert bsStyle={ alert_style }>
            { message_text }
          </Alert>
        )
      }
    }

    const submitting = data.submitting
    let submitting_class = ''
    if (submitting)
      submitting_class = 'disabled'
    const input_style = {
      border: 'none',
      ...S('border-bottom-1-solid-ccc br-0 p-0')
    }
    let main_content = (
      <div>
        <div style={ S('color-929292 mb-20') }>Forgot your password?</div>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input style={ input_style } bsStyle={ email_style } ref="email" placeholder="Email address" type="text" />
          { message }
          <Col sm={4} className="forgot__password-btn--cancel" style={ S('p-0 pr-10') }>
            <Link className="btn btn-default" style={ S('w-100p') } to="/signin">Cancel</Link>
          </Col>
          <Col sm={8} style={ S('p-0') }>
            <Button type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p') }>
              { submitting ? 'Submitting...' : 'Reset Password' }
            </Button>
          </Col>
          <div className="clearfix"></div>
          <div style={ S('mt-20 color-929292 font-13') }>Change your mind? <Link to="/signin">Sign in</Link></div>
        </form>
      </div>
    )

    if (data.status === 'success') {
      main_content = (
        <div>
          { message }
          <Link style={ S('w-100p') } className="btn btn-primary" to="/">Done</Link>
        </div>
      )
    }

    return (
      <div className="center-block" style={ S('maxw-300') }>
        <h1 className="tempo">Rechat</h1>
        { main_content }
      </div>
    )
  }
}

// PropTypes
Forgot.propTypes = {
  data: React.PropTypes.object,
  handleSubmit: React.PropTypes.func.isRequired
}