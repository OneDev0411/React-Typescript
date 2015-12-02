// Phone.js
import React, { Component } from 'react'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'

export default class Phone extends Component {

  render(){
    
    return (
      <div className="center-block" style={ S('maxw-150') }>
        <div style={ S('color-929292 mb-20') }>Confirm your phone</div>
        <form>
          <Input placeholder="Enter 4 digit code" type="text" maxLength="4" />
          <Button bsStyle="primary" style={ S('w-100p') }>Verify</Button>
        </form>
      </div>
    )
  }
}