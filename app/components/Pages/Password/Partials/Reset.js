// Reset.js
import React, { Component } from 'react'
import { Input, Button } from 'react-bootstrap'
import S from 'shorti'

export default class Reset extends Component {

  render(){
    
    return (
      <div className="center-block" style={ S('maxw-300') }>
        <div style={ S('color-929292 mb-20') }>Reset your password</div>
        <form>
          <Input placeholder="New Password" type="text" />
          <Input placeholder="Confirm New Password" type="text" />
          <Button style={ S('w-100p') } type="submit" bsStyle="primary">Change Password</Button>
          <div style={ S('mt-20 color-929292 font-13') }>Code not working? <a href="#">Try sending it again</a></div>
        </form>
      </div>
    )
  }
}