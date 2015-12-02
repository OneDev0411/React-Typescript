// Forgot.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Input, Button, Col, Alert } from 'react-bootstrap'
import S from 'shorti'

export default class Forgot extends Component {

  handleSubmit(e){
    
    e.preventDefault()
    let email = this.refs.email.getInputDOMNode().value
    let form_data = {
      email: email
    }
    
    this.props.handleSubmit('forgot-password',form_data)

  }

  render(){
    
    const data = this.props.data
    let errors = data.errors
    
    let email_style
    let message
    let message_text
    let alert_style
    
    if(data.show_message){
      
      // Errors
      if(errors){
        
        if(data.email_not_found){
          email_style = 'error'
          alert_style = 'warning'
          message_text = (
            <div>Sorry, that email address is not registered with us.<br/> <Link to="/">Please try again or register for a new account</Link>.</div>
          )
        }

        if(data.email_invalid){
          email_style = 'error'
          alert_style = 'danger'
          message_text = 'Oops! That looks like an invalid email address!'
        }
      }

      // Success
      if(data.status === 'success'){
        this.refs.email.getInputDOMNode().value = ''
        this.refs.email.getInputDOMNode().blur()
        email_style = null
        alert_style = 'success'
        message_text = `We've sent you an email with instructions on how to reset your password.  Please check your email.`
      }

      message = (
        <Alert bsStyle={ alert_style }>
          { message_text }
        </Alert>
      )
    }

    let main_content = (
      <div>
        <div style={ S('color-929292 mb-20') }>Forgot your password?</div>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input bsStyle={ email_style } ref="email" placeholder="Email address" type="text" />
          { message }
          <Col sm={4} style={ S('p-0 pr-10') }>
            <Link className="btn btn-default" style={ S('w-100p') } to="/signin">Cancel</Link>
          </Col>
          <Col sm={8} style={ S('p-0') }>
            <Button type="submit" style={ S('w-100p') } bsStyle="primary">Reset Password</Button>
          </Col>
          <div className="clearfix"></div>
          <div style={ S('mt-20 color-929292 font-13') }>Change your mind? <Link to="/signin">Sign in</Link></div>
        </form>
      </div>
    )

    if(data.status === 'success'){
      main_content = (
        <div>
          { message }
          <Link style={ S('w-100p') } className="btn btn-primary" to="/">Done</Link>
        </div>
      )
    }

    return (
      <div className="center-block" style={ S('maxw-400') }>
        { main_content }
      </div>
    )
  }
}