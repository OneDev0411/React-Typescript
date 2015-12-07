// SignUp.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Button, Input, Alert } from 'react-bootstrap'
import S from 'shorti'

// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

// AppStore
import AppStore from '../../stores/AppStore'

// Partials
import BigHeading from '../Partials/BigHeading'

export default class SignUp extends Component {

  componentWillMount(){
    // Reset data store before mounting
    AppStore.data = {}
    AppStore.emitChange()
  }

  handleSubmit(e){
    
    e.preventDefault()
    AppStore.data.submitting = true
    AppStore.emitChange()
    
    let email = this.refs.email.refs.input.value
    let password = this.refs.password.refs.input.value
    let confirm_password = this.refs.confirm_password.refs.input.value

    // Random phone for now
    const random_phone = Math.floor(Math.random() * 1000000000)

    const user = {
      first_name: 'Test',
      last_name: 'User',
      email: email,
      user_type: 'Client',
      phone_number: random_phone,
      grant_type: 'password'
    }

    AppDispatcher.dispatch({
      action: 'sign-up',
      user: user,
      password: password,
      confirm_password: confirm_password,
      redirect_to: ''
    })
  }

  render(){
    
    // Data
    const data = this.props.data
    
    let type
    if(this.props.location.query.type){
      type = this.props.location.query.type
    }

    // If show message
    let message
    let email_style
    let password_style

    /* Handle erros
    ======================== */
    let errors = data.errors
    if(data.show_message && errors){
      if(data.error_type == 'email'){
        email_style = 'error'
        message = (
          <Alert bsStyle="danger">This email is invalid.</Alert>
        )
      }
      if(data.error_type == 'password'){
        let password_error = data.password_error
        password_style = 'error'
        if(data.password_error == 'no-match'){
          message = (
            <Alert bsStyle="danger">Your password and confirm password must match.</Alert>
          )
        }
        if(password_error == 'too-short'){
          message = (
            <Alert bsStyle="danger">Your password must be at least 6 characters long.</Alert>
          )
        }
      }
      if(data.error_type == 'server' && data.response == 'email-in-use'){
        email_style = 'error'
        message = (
          <Alert bsStyle="warning">This email is already in our system.  You may try to <Link to="/signin">sign in</Link>.</Alert>
        )
      }
    }

    // Style
    const signup_button_style = S('w-100p')
    const lightWeight = S('fw-100')

    let submitting = data.submitting
    let submitting_class
    if(submitting){
      submitting_class = 'disabled'
    }

    let main_content = (
      <div>
        <h1 style={ lightWeight }>Sign up as { type }</h1>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input bsStyle={ email_style } type="text" ref="email" placeholder="Email"/>
          <Input bsStyle={ password_style } type="password" ref="password" placeholder="Password"/>
          <Input bsStyle={ password_style } type="password" ref="confirm_password" placeholder="Confirm Password"/>
          { message }
          <Button 
            type="submit"
            ref="submit"
            className={ submitting_class + "btn btn-primary" }
            disabled={ submitting }
            style={ S('w-100p mb-20') }
          >
            { submitting ? 'Signing up...' : 'Sign up' }
          </Button>
          <div style={ S('color-929292 font-13 mt-20') }>Already have an account?  <Link to="signin">Sign in</Link></div>
        </form>
      </div>
    )

    /* Handle success
    ======================== */
    if(data.show_message && data.status === 'success'){
      main_content = (
        <Alert bsStyle="success">
          Success!  Your account was created.  You may now <Link to="/signin">sign in</Link>.
        </Alert>
      )
    }
    return (
      <div id="main-content" className="container">
        <div className="text-center center-block" style={ S('maxw-300') }>
          <BigHeading />
          { main_content }
        </div>
      </div>
    )
  }
}