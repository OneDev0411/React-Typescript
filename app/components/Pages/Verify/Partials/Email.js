// Email.js
import React, { Component } from 'react'
import S from 'shorti'
import helpers from '../../../../utils/helpers'

export default class Email extends Component {
  render() {
    const token = helpers.getParameterByName('token')
    const status = helpers.getParameterByName('status')

    let main_content

    if (!status) {
      main_content = (
        <div>
          <a className="btn btn-primary" href={'/verify_email/submitted?token=' + token} >Confirm your email</a>
        </div>
      )
    }

    if (status === 'success') {
      main_content = (
        <div>
          <img style={ S('w-186 h-188') } src="/images/verify/family-1@2x.png"/>
          <div style={ S('color-929292 mt-10 font-36') }>Email confirmed.</div>
          <a href="/signin">Sign in</a>
        </div>
      )
    }

    if (status === 'error') {
      main_content = (
        <div>
          <img style={ S('w-80 h-80') } src="/images/verify/sad-face@2x.png"/>
          <div style={ S('color-929292 mt-10 font-14') }>Your reset password link has expired.</div>
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