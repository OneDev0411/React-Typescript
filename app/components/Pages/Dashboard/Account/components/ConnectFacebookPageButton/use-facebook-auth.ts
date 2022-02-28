import { useRef } from 'react'

import { useEffectOnce } from 'react-use'

import { FacebookAuthErrorCode } from './types'
import { useFacebookResultMessage } from './use-facebook-result-message'

const facebookAuthUrl = '/users/self/facebook/auth'

export interface UseFacebookAuthOptions {
  onAuthWindowOpen?: () => void
  onAuthWindowClose?: () => void
  onAuthSuccess?: () => void
  onAuthError?: (errorCode: FacebookAuthErrorCode) => void
}

interface UseFacebookAuth {
  openAuthWindow: () => void
}

export function useFacebookAuth({
  onAuthWindowOpen,
  onAuthWindowClose,
  onAuthSuccess,
  onAuthError
}: UseFacebookAuthOptions): UseFacebookAuth {
  const authWindowRef = useRef<Nullable<Window>>(null)
  const checkIntervalRef = useRef<Nullable<NodeJS.Timer>>(null)

  // Open the auth window
  const openAuthWindow = () => {
    if (authWindowRef.current) {
      return
    }

    const windowHandle = window.open(
      facebookAuthUrl,
      'sharer',
      'toolbar=0,status=0,width=548,height=325'
    )

    if (!windowHandle) {
      return
    }

    onAuthWindowOpen?.()
    authWindowRef.current = windowHandle

    // The beforeunload event does not work here because of CORS issue so it needs to have
    // a check interval to check if the auth window is closed
    checkIntervalRef.current = setInterval(() => {
      if (!windowHandle.closed || !checkIntervalRef.current) {
        return
      }

      clearInterval(checkIntervalRef.current)
      checkIntervalRef.current = null

      onAuthWindowClose?.()
      authWindowRef.current = null
    }, 1000)
  }

  // Close the auth window when the component unmounts
  useEffectOnce(() => {
    return () => {
      authWindowRef.current?.close()
    }
  })

  // Call onAuthSuccess and onAuthError if needed
  useFacebookResultMessage(payload => {
    if (payload.type === 'success') {
      onAuthSuccess?.()

      return
    }

    onAuthError?.(payload.errorCode)
  })

  return {
    openAuthWindow
  }
}
