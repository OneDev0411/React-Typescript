import { useRef, useState } from 'react'

import { useEffectOnce } from 'react-use'

import { FacebookAuthErrorCode } from './types'
import { useFacebookResultMessage } from './use-facebook-result-message'

const facebookAuthUrl = '/users/self/facebook/auth'

export interface UseFacebookAuthOptions {
  onAuthSuccess?: () => void
  onAuthError?: (errorCode: FacebookAuthErrorCode) => void
}

interface UseFacebookAuth {
  isAuthWindowOpen: boolean
  openAuthWindow: () => void
}

export function useFacebookAuth({
  onAuthSuccess,
  onAuthError
}: UseFacebookAuthOptions): UseFacebookAuth {
  const authWindowRef = useRef<Nullable<Window>>(null)
  const [isAuthWindowOpen, setIsAuthWindowOpen] = useState(false)

  // Close the auth window
  const handleCloseAuthWindow = () => {
    setIsAuthWindowOpen(false)
    authWindowRef.current = null
  }

  // Open the auth window
  const openAuthWindow = () => {
    const windowHandle = window.open(facebookAuthUrl, '_blank')

    if (windowHandle) {
      windowHandle.addEventListener('beforeunload', handleCloseAuthWindow)
    }

    authWindowRef.current = windowHandle

    setIsAuthWindowOpen(!!windowHandle)
  }

  // Close the window when the component unmounts
  useEffectOnce(() => {
    const authWindow = authWindowRef.current

    return () => {
      authWindow?.close()
    }
  })

  useFacebookResultMessage(payload => {
    authWindowRef.current?.close() // Close the auth window

    if (payload.type === 'success') {
      onAuthSuccess?.()

      return
    }

    onAuthError?.(payload.errorCode)
  })

  return {
    isAuthWindowOpen,
    openAuthWindow
  }
}
