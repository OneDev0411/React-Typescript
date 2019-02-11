import React from 'react'

import config from 'config'

import { Container, Button } from './styled'

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

export function Docusign(props) {
  if (!props.isOpen) {
    return false
  }

  return (
    <Container>
      For electronic signatures you need to log into your Docusign account
      <Button
        size="small"
        onClick={() => loginToDocusign(props.user, props.onAuthorize)}
      >
        Login
      </Button>
      <img src="/static/images/deals/docusign.png" alt="" />
    </Container>
  )
}
