import React, { useEffect, useState } from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

export default function EmailVerificationBanner({ email, show = false }) {
  const [isShow, setIsShow] = useState(show)

  useEffect(() => {
    let state: string | null = window.localStorage.getItem(
      'verificationEmailBanner'
    )

    if (state == null) {
      window.localStorage.setItem('verificationEmailBanner', 'show')
      setIsShow(true)
    } else if (state === 'hide') {
      setIsShow(false)
    }
  }, [])

  const onHide = () => {
    setIsShow(false)
    window.localStorage.setItem('verificationEmailBanner', 'hide')
  }

  if (!isShow) {
    return null
  }

  return (
    <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={() => onHide()} severity="info">
        {`To verify that it's you, please confirm your email: "${email}".`}
      </Alert>
    </Snackbar>
  )
}
