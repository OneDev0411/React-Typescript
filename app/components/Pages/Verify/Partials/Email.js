// Email.js
import React, { Component } from 'react'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'

export default class Email extends Component {

  render(){
    
    return (
      <div className="center-block" style={ S('maxw-400') }>
        <img src="/images/verify/family-1.png"/>
        <div style={ S('color-929292 mt-50 font-40') }>Email confirmed.</div>
      </div>
    )
  }
}