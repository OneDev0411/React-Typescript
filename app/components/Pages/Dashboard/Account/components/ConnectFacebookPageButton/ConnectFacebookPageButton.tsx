import { useContext, useState, forwardRef, Ref } from 'react'

import { Button, ButtonProps, CircularProgress } from '@material-ui/core'

import ConfirmationModalContext from '@app/views/components/ConfirmationModal/context'

import { FacebookAuthErrorCode } from './types'
import { useFacebookAuth, UseFacebookAuthOptions } from './use-facebook-auth'
import { useInvalidateFacebookPagesListQuery } from './use-invalidate-facebook-pages-list-query'

export interface ConnectFacebookPageButtonProps
  extends Omit<ButtonProps, 'onClick' | 'startIcon' | 'disabled'>,
    Pick<
      UseFacebookAuthOptions,
      'onAuthSuccess' | 'onAuthError' | 'onAuthWindowOpen' | 'onAuthWindowClose'
    > {
  onErrorDialogOpen?: () => void
  onErrorDialogClose?: () => void
}

function ConnectFacebookPageButton(
  {
    onAuthSuccess,
    onAuthError,
    onAuthWindowOpen,
    onAuthWindowClose,
    onErrorDialogOpen,
    onErrorDialogClose,
    ...buttonProps
  }: ConnectFacebookPageButtonProps,
  ref: Ref<HTMLButtonElement>
) {
  const [isWorking, setIsWorking] = useState(false)
  const confirmation = useContext(ConfirmationModalContext)
  const invalidateListQuery = useInvalidateFacebookPagesListQuery()

  const handleAuthError = (
    errorCode: FacebookAuthErrorCode,
    errorMessage: Optional<string>
  ) => {
    onErrorDialogOpen?.()

    confirmation.setConfirmationModal({
      message: 'Something went wrong!',
      description:
        'We are unable to connect to Instagram at the moment. Please try again soon and you’ll be up and running shortly!',
      confirmLabel: 'OK',
      needsCancel: false,
      onConfirm: () => {
        onErrorDialogClose?.()
      }
    })

    onAuthError?.(errorCode, errorMessage)
  }

  const handleAuthSuccess = () => {
    invalidateListQuery()
    onAuthSuccess?.()
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
    onAuthSuccess: handleAuthSuccess,
    onAuthError: handleAuthError
  })

  return (
    <Button
      {...buttonProps}
      ref={ref}
      size="small"
      onClick={openAuthWindow}
      startIcon={
        isWorking ? <CircularProgress size={20} color="inherit" /> : null
      }
      disabled={isWorking}
    />
  )
}

export default forwardRef(ConnectFacebookPageButton)
