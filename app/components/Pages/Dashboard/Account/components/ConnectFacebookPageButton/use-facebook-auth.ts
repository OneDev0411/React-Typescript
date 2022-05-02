import { useRef } from 'react'

import { useSelector } from 'react-redux'
import { useEffectOnce } from 'react-use'

import { useActiveBrandId } from '@app/hooks/brand'
import { selectUserAccessToken } from '@app/selectors/user'

import { FacebookAuthErrorCode } from './types'
import { useFacebookResultMessage } from './use-facebook-result-message'

const FACEBOOK_AUTH_URL = '/api/facebook/login'
const POPUP_WIDTH = 600
const POPUP_HEIGHT = 500

export interface UseFacebookAuthOptions {
  onAuthWindowOpen?: () => void
  onAuthWindowClose?: () => void
  onAuthSuccess?: () => void
  onAuthError?: (
    errorCode: FacebookAuthErrorCode,
    message: Optional<string>
  ) => void
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
  const accessToken = useSelector(selectUserAccessToken)
  const activeBrandId = useActiveBrandId()

  // Open the auth window
  const openAuthWindow = () => {
    if (authWindowRef.current) {
      return
    }

    const popupLeft = window.screen.width / 2 - POPUP_WIDTH / 2
    const popupTop = window.screen.height / 2 - POPUP_HEIGHT / 2

    const windowHandle = window.open(
      `${FACEBOOK_AUTH_URL}?access_token=${accessToken}&brand_id=${activeBrandId}`,
      'sharer',
      `toolbar=0,status=0,location=0,width=${POPUP_WIDTH},height=${POPUP_HEIGHT},top=${popupTop},left=${popupLeft}`
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

    onAuthError?.(payload.errorCode, payload.errorMessage)
  })

  return {
    openAuthWindow
  }
}
