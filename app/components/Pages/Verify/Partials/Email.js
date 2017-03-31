// Email.js
import React, { Component } from 'react'
import S from 'shorti'
import helpers from '../../../../utils/helpers'

export default class Email extends Component {
  render() {
    const decoded_token = decodeURIComponent(helpers.getParameterByName('token'))
    const encoded_token = encodeURIComponent(decoded_token)
    const status = helpers.getParameterByName('status')
    const email = encodeURIComponent(helpers.getParameterByName('email'))
    let main_content
    if (!status) {
      main_content = (
        <div>
          <a className="btn btn-primary" href={`/verify_email/submitted?token=${encoded_token}`} >Confirm your email</a>
        </div>
      )
    }

    if (status === 'success') {
      main_content = (
        <div>
          <img style={S('w-186 h-188')} src="/static/images/verify/family-1@2x.png" />
          <div style={S('color-929292 mt-10 font-36')}>Email confirmed.</div>
          <a className="btn btn-primary" href={`/password/create?token=${encoded_token}&email=${email}`}>Create your password</a>
        </div>
      )
    }

    if (status === 'error') {
      main_content = (
        <div>
          <img style={S('w-80 h-80')} src="/static/images/verify/sad-face@2x.png" />
          <div style={S('color-929292 mt-10 font-14')}>Your reset password link has expired.</div>
        </div>
      )
    }

    return (
      <div className="center-block" style={S('maxw-300')}>
        { main_content }
      </div>
    )
  }
}
