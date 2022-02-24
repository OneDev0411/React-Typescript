import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import { useFacebookAuth, UseFacebookAuthOptions } from './use-facebook-auth'

interface ConnectInstagramAccountButtonProps
  extends Omit<ButtonProps, 'size' | 'onClick' | 'startIcon' | 'disabled'>,
    UseFacebookAuthOptions {}

function ConnectInstagramAccountButton({
  onAuthSuccess,
  onAuthError,
  ...buttonProps
}: ConnectInstagramAccountButtonProps) {
  const { isAuthWindowOpen, openAuthWindow } = useFacebookAuth({
    onAuthSuccess,
    onAuthError
  })

  return (
    <Button
      size="small"
      onClick={openAuthWindow}
      startIcon={
        isAuthWindowOpen ? <CircularProgress size={20} color="inherit" /> : null
      }
      disabled={isAuthWindowOpen}
      {...buttonProps}
    />
  )
}

export default ConnectInstagramAccountButton
