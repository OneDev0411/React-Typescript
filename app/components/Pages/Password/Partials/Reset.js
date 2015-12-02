// Reset.js
import React, { Component } from 'react'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'
import helpers from '../../../../utils/helpers'

export default class Reset extends Component {

  handleSubmit(e){
    
    e.preventDefault()
    
    // Get token
    let password = this.refs.password.getInputDOMNode().value.trim()
    let confirm_password = this.refs.confirm_password.getInputDOMNode().value.trim()
    let token = helpers.getParameterByName('token')

    if(password.length < 6){
      return console.log('password must be over 6 chars long')
    }
    
    if(password !== confirm_password){
      return console.log('these do not match bruh')
    }

    let form_data = {
      password: password,
      token: token
    }

    this.props.handleSubmit('reset-password', form_data)

  }

  render(){
    
    return (
      <div className="center-block" style={ S('maxw-300') }>
        <div style={ S('color-929292 mb-20') }>Reset your password</div>
        <form onSubmit={ this.handleSubmit.bind(this) }>
          <Input placeholder="New Password" type="text" ref="password"/>
          <Input placeholder="Confirm New Password" type="text" ref="confirm_password"/>
          <Button style={ S('w-100p') } type="submit" bsStyle="primary">Change Password</Button>
          <div style={ S('mt-20 color-929292 font-13') }>Code not working? <a href="#">Try sending it again</a></div>
        </form>
      </div>
    )
  }
}