import { useState } from 'react'

import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import { useFacebookAuth, UseFacebookAuthOptions } from './use-facebook-auth'

interface ConnectInstagramAccountButtonProps
  extends Omit<ButtonProps, 'size' | 'onClick' | 'startIcon' | 'disabled'>,
    Pick<UseFacebookAuthOptions, 'onAuthSuccess' | 'onAuthError'> {}

function ConnectInstagramAccountButton({
  onAuthSuccess,
  onAuthError,
  ...buttonProps
}: ConnectInstagramAccountButtonProps) {
  const [isWorking, setIsWorking] = useState(false)

  const { openAuthWindow } = useFacebookAuth({
    onAuthWindowOpen: () => setIsWorking(true),
    onAuthWindowClose: () => setIsWorking(false),
    onAuthSuccess,
    onAuthError
  })

  return (
    <Button
      size="small"
      onClick={openAuthWindow}
      startIcon={
        isWorking ? <CircularProgress size={20} color="inherit" /> : null
      }
      disabled={isWorking}
      {...buttonProps}
    />
  )
}

export default ConnectInstagramAccountButton
