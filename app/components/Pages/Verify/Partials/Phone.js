// Phone.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Input, Button, Alert } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../utils/helpers'

export default class Phone extends Component {
  handleSubmit(e) {
    e.preventDefault()
    const code = this.refs.code.refs.input.value
    const token = helpers.getParameterByName('token')
    this.props.handleSubmit(code, token)
  }

  render() {
    // Data
    const data = this.props.data
    const errors = data.errors

    let code_style
    let message
    let message_text
    let alert_style

    // Errors
    if (errors) {
      message_text = `This token or code is invalid.`
      alert_style = 'danger'
    }

    if (data.show_message) {
      // Success
      if (data.status === 'success') {
        alert_style = 'success'
        message_text = `Your phone is now verified.`
      }

      // Error
      if (data.request_error) {
        alert_style = 'danger'
        message_text = (
          <div>
            There was an error with this request.  Please try again.
          </div>
        )
      }

      message = (
        <Alert bsStyle={ alert_style }>
          { message_text }
        </Alert>
      )
    }

    let main_content = (
      <div>
        <div style={ S('color-929292 mb-20') }>Confirm your phone</div>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input bsStyle={ code_style } ref="code" placeholder="Enter 5 digit code" type="text" maxLength="5" />
          { message }
          <Button type="submit" bsStyle="primary" style={ S('w-100p') }>Verify</Button>
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
      <div className="center-block" style={ S('maxw-150') }>
        { main_content }
      </div>
    )
  }
}

// PropTypes
Phone.propTypes = {
  data: React.PropTypes.object,
  handleSubmit: React.PropTypes.func.isRequired
}