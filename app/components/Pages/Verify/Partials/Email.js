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
        <img src="/images/verify/family-1.png"/>
        <div style={ S('color-929292 mt-50 font-36') }>Email confirmed.</div>  
      </div>
    )

    if(data.status == 'error'){
      main_content = (
        <div>
          <img src="/images/verify/sad-face.png"/>
          <div style={ S('color-929292 mt-10 font-14') }>Your reset password link has expired.</div>  
          <div style={ S('color-929292 mt-10') }>
            <Link onClick={ this.handleClick.bind(this) }>Send me a new one</Link>
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