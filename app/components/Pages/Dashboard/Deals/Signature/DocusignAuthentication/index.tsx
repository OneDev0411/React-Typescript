import React from 'react'

import { Container, Button } from './styled'

interface Props {
  isOpen: boolean
  user: IUser
  onAuthorize: () => Promise<void>
}

export function DocusignAuthentication(props: Props) {
  if (!props.isOpen) {
    return null
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

/**
 * open login-to-docusign popup
 */
function loginToDocusign(user: IUser, onAuthorize: () => void) {
  const token = user.access_token
  const login = window.open(
    `/api/deals/docusign/login?access_token=${token}`,
    'sharer',
    'toolbar=0,status=0,width=548,height=325'
  )

  window.addEventListener(
    'message',
    () => {
      login && login.close()

      setTimeout(() => {
        onAuthorize()
      }, 200)
    },
    false
  )
}
