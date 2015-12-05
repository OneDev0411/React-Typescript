// SignIn.js
import React, { Component } from 'react'
import { Link, History } from 'react-router'
import { Button, Input, Alert } from 'react-bootstrap'
import S from 'shorti'

// AppStore
import AppStore from '../../stores/AppStore'

// AppDispatcher
import AppDispatcher from '../../dispatcher/AppDispatcher'

// Partials
import BigHeading from '../Partials/BigHeading'

export default class SignIn extends Component {

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

    AppDispatcher.dispatch({
      action: 'sign-in',
      email: email,
      password: password,
      redirect_to: '/dashboard/recents' // change to referrer
    })

  }

  componentDidUpdate(){

    // If sign in successful
    let data = this.props.data
    if(data.user)
      this.props.history.pushState(null, '/dashboard/recents')
  }

  render(){
    
    // Data
    const data = this.props.data
    const btnStyle = S('w-200 mb-20')
    const lightWeight = S('fw-100')
    
    // Validation
    let errors = data.errors
    let validation = data.validation
    let email_style
    let password_style
    if(errors && !validation.email)
      email_style = 'error'
    
    if(errors && !validation.password)
      password_style = 'error'

    let submitting = data.submitting
    let submitting_class
    if(submitting)
      submitting_class = 'disabled'
    
    let message
    if(data.show_message)
      message = (
        <Alert bsStyle="danger">
          There was an error with this request.
        </Alert>
      )

    return (
      <div id="main-content" className="container">
        <div className="text-center center-block" style={ S('maxw-300') }>
          <BigHeading />
          <h1 style={ lightWeight }>Sign in</h1>
          <form action="/signin" onSubmit={ this.handleSubmit.bind(this) }>
            <Input bsStyle={ email_style } type="text" ref="email" placeholder="Email"/>
            <Input bsStyle={ password_style } type="password" ref="password" placeholder="Password"/>
            <div style={ S('color-929292 font-13 mt-0 mb-10') } className="pull-right"><Link to="/password/forgot">Forgot Password</Link></div>
            <div className="clearfix"></div>
            { message }
            <Button 
              type="submit"
              ref="submit"
              className={ submitting_class + "btn btn-primary" }
              disabled={ submitting }
              style={ S('w-100p mb-20') }
            >
              { submitting ? 'Signing in...' : 'Sign in' }
            </Button>
            <div style={ S('color-929292 font-13') }>Don't have an account yet?  <Link to="/">Sign up</Link></div>
          </form>
        </div>
      </div>
    )
  }
}