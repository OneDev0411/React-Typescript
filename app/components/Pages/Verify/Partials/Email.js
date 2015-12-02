// Email.js
import React, { Component } from 'react'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'

export default class Email extends Component {

  render(){
    
    return (
      <div className="center-block" style={ S('maxw-400') }>
        <div style={ S('color-929292 mb-20') }>Confirm your email</div>
        <form>
          <Button>Resend</Button>
        </form>
      </div>
    )
  }
}