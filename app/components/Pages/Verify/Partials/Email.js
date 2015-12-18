// Email.js
import React, { Component } from 'react'
import { Link } from 'react-router'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'

export default class Email extends Component {
  
  handleClick(){
    // send new confirm
  }

  render(){
    
    const data = this.props.data

    let main_content = (
      <div>
        <img style={ S('w-186') } src="/images/verify/family-1@2x.png"/>
        <div style={ S('color-929292 mt-10 font-36') }>Email confirmed.</div>  
      </div>
    )

    if(data.status == 'error'){
      main_content = (
        <div>
          <img style={ S('w-74') } src="/images/verify/sad-face@2x.png"/>
          <div style={ S('color-929292 mt-10 font-14') }>Your reset password link has expired.</div>  
          <div style={ S('color-929292 mt-10') }>
            <a href="#" onClick={ this.handleClick.bind(this) }>Send me a new one</a>
          </div>
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