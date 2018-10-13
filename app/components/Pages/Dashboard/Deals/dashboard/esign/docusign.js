import React from 'react'
import config from '../../../../../../../config/public'

/**
 * open login-to-docusign popup
 */
function loginToDocusign(user, onAuthorize) {
  const token = user.access_token
  const login = window.open(
    `${config.app.url}/api/deals/docusign/login?access_token=${token}`,
    'sharer',
    'toolbar=0,status=0,width=548,height=325'
  )

  window.addEventListener(
    'message',
    () => {
      login.close()

      setTimeout(() => {
        onAuthorize()
      }, 200)
    },
    false
  )
}

export default ({ user, show, onAuthorize }) => {
  if (!show) {
    return false
  }

  return (
    <div className="deal-esign-docusign">
      For electronic signatures you need to log into your Docusign account
      <button
        className="btn-login"
        onClick={() => loginToDocusign(user, onAuthorize)}
      >
        Login
      </button>
      <img src="/static/images/deals/docusign.png" alt="" />
    </div>
  )
}
