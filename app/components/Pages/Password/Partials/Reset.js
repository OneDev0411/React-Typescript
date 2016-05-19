// Reset.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Input, Button, Alert } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../utils/helpers'

// AppStore
import AppStore from '../../../../stores/AppStore'

export default class Reset extends Component {

  handleSubmit(e) {
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()

    // Get token
    const password = this.refs.password.getInputDOMNode().value.trim()
    const confirm_password = this.refs.confirm_password.getInputDOMNode().value.trim()
    const decoded_token = decodeURIComponent(helpers.getParameterByName('token'))
    const encoded_token = encodeURIComponent(decoded_token)

    const form_data = {
      password,
      confirm_password,
      token: encoded_token
    }

    this.props.handleSubmit('reset-password', form_data)
  }

  render() {
    const data = this.props.data
    const errors = data.errors

    let password_style
    let password_error
    let message
    let message_text
    let alert_style

    // Errors
    if (errors) {
      if (data.password_error) {
        password_error = data.password_error
        password_style = 'error'
        alert_style = 'danger'
        if (password_error === 'too-short')
          message_text = 'Your password must be at least 6 characters long.'

        if (password_error === 'no-match')
          message_text = `Your passwords don't match`
      }
    }
    if (data.show_message) {
      // Success
      if (data.status === 'success') {
        alert_style = 'success'
        message_text = `Your password is now changed.  You may now sign in.`
      }

      // Error
      if (data.request_error) {
        alert_style = 'danger'
        message_text = (
          <div>
            There was an error with this request.  Please <a href="/password/forgot">request a new password</a>.
          </div>
        )
      }

      message = (
        <Alert bsStyle={ alert_style }>
          { message_text }
        </Alert>
      )
    }

    const submitting = data.submitting
    let submitting_class = ''
    if (submitting)
      submitting_class = 'disabled'

    let main_content = (
      <div>
        <div style={ S('color-929292 mb-20') }>Reset your password</div>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input bsStyle={ password_style } placeholder="New Password" type="password" ref="password"/>
          <Input bsStyle={ password_style } placeholder="Confirm New Password" type="password" ref="confirm_password"/>
          { message }
          <Button type="submit" ref="submit" className={ submitting_class + 'btn btn-primary' } disabled={ submitting } style={ S('w-100p') }>
            { submitting ? 'Submitting...' : 'Change Password' }
          </Button>
          <div style={ S('mt-20 color-929292 font-13') }>Code not working? <Link to="/password/forgot">Try sending it again</Link></div>
        </form>
      </div>
    )

    if (data.status === 'success') {
      main_content = (
        <div>
          { message }
          <Link style={ S('w-100p') } className="btn btn-primary" to="/signin">Sign in</Link>
        </div>
      )
    }
    return (
      <div className="center-block" style={ S('maxw-300') }>
        { main_content }
      </div>
    )
  }
}

// PropTypes
Reset.propTypes = {
  data: React.PropTypes.object,
  handleSubmit: React.PropTypes.func.isRequired
}