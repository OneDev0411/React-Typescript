// Email.js
import React, { Component } from 'react'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'

export default class Email extends Component {
  
  render(){
    
    const data = this.props.data

    let main_content = (
      <div>
        <img src="/images/verify/family-1.png"/>
        <div style={ S('color-929292 mt-50 font-40') }>Email confirmed.</div>  
      </div>
    )

    if(data.status == 'error'){
      main_content = (
        <h1>Oops</h1>
      )
    }
    
    return (
      <div className="center-block" style={ S('maxw-400') }>
        { main_content }
      </div>
    )
  }
}