import { useContext, useState } from 'react'

import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { FacebookAuthErrorCode } from './types'
import { useFacebookAuth, UseFacebookAuthOptions } from './use-facebook-auth'

export interface ConnectFacebookPageButtonProps
  extends Omit<ButtonProps, 'onClick' | 'startIcon' | 'disabled'>,
    Pick<
      UseFacebookAuthOptions,
      'onAuthSuccess' | 'onAuthError' | 'onAuthWindowOpen' | 'onAuthWindowClose'
    > {
  onErrorDialogOpen?: () => void
  onErrorDialogClose?: () => void
}

function ConnectFacebookPageButton({
  onAuthSuccess,
  onAuthError,
  onAuthWindowOpen,
  onAuthWindowClose,
  onErrorDialogOpen,
  onErrorDialogClose,
  ...buttonProps
}: ConnectFacebookPageButtonProps) {
  const [isWorking, setIsWorking] = useState(false)

  const confirmation = useContext(ConfirmationModalContext)

  const handleAuthError = (errorCode: FacebookAuthErrorCode) => {
    onErrorDialogOpen?.()

    confirmation.setConfirmationModal({
      message: 'Something went wrong!',
      description: `We’re unable to connect to instagram at this moment. Please try again later.\nerror code: ${errorCode}`,
      confirmLabel: 'Ok',
      needsCancel: false,
      onConfirm: () => {
        onErrorDialogClose?.()
      }
    })

    onAuthError?.(errorCode)
  }

  const { openAuthWindow } = useFacebookAuth({
    onAuthWindowOpen: () => {
      setIsWorking(true)
      onAuthWindowOpen?.()
    },
    onAuthWindowClose: () => {
      setIsWorking(false)
      onAuthWindowClose?.()
    },
    onAuthSuccess,
    onAuthError: handleAuthError
  })

  return (
    <Button
      {...buttonProps}
      size="small"
      onClick={openAuthWindow}
      startIcon={
        isWorking ? <CircularProgress size={20} color="inherit" /> : null
      }
      disabled={isWorking}
    />
  )
}

export default ConnectFacebookPageButton
