import React from 'react'
import { useSelector } from 'react-redux'

import { selectUser } from 'selectors/user'

import { Container, Button } from './styled'

interface Props {
  isOpen: boolean
  onAuthorize: () => void
}

export function DocusignAuthentication({ isOpen, onAuthorize }: Props) {
  const user = useSelector(selectUser)

  if (!isOpen) {
    return null
  }

  /**
   * open login-to-docusign popup
   */
  const loginToDocusign = () => {
    console.log('[ + ] Start Authorizing Docusign')

    const token = user.access_token
    const login = window.open(
      `/api/deals/docusign/login?access_token=${token}`,
      'sharer',
      'toolbar=0,status=0,width=548,height=325'
    )

    const onMessage = () => {
      console.log('[ + ] Docusign Authorized')
      login?.close()

      onAuthorize()

      window.removeEventListener('message', onMessage)
    }

    window.addEventListener('message', onMessage, false)
  }

  return (
    <Container>
      For electronic signatures you need to log into your Docusign account
      <Button size="small" onClick={() => loginToDocusign()}>
        Login
      </Button>
      <img src="/static/images/deals/docusign.png" alt="" />
    </Container>
  )
}
