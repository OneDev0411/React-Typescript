import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Snackbar, Box, Button } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

import verify from '../../../models/verify'

export default function EmailVerificationBanner({ email }) {
  const [isHide, setIsHide] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const previousEmail = useRef(email)

  useEffect(() => {
    if (email !== previousEmail.current) {
      setIsHide(false)
    }
  }, [email])

  const onHide = () => {
    setIsHide(true)
  }

  const sendVerificationLink = useCallback(async () => {
    setIsSending(true)
    await verify.request('email')
    setIsSending(false)
    setIsSent(true)
  }, [])

  if (isHide) {
    return null
  }

  return (
    <Snackbar open anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <Alert onClose={() => onHide()} severity="info">
        <Box
          mb={1}
        >{`To verify that it's you, please confirm your email: "${email}".`}</Box>
        {!isSent && (
          <div>
            <Button
              variant="text"
              color="secondary"
              disabled={isSending}
              onClick={sendVerificationLink}
            >
              {isSending ? 'Sending...' : 'Send a new verification link'}
            </Button>
          </div>
        )}
      </Alert>
    </Snackbar>
  )
}
