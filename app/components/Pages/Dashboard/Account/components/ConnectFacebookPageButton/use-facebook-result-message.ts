import { useEffect } from 'react'

import { FacebookResultMessagePayload } from './types'

export function useFacebookResultMessage(
  onMessage: (payload: FacebookResultMessagePayload) => void
): void {
  useEffect(() => {
    const processMessage = (
      event: MessageEvent<{
        source: string
        payload: FacebookResultMessagePayload
      }>
    ) => {
      const { source, payload } = event.data

      if (source !== 'facebook-auth-result') {
        return
      }

      onMessage(payload)
    }

    window.addEventListener('message', processMessage)

    return () => {
      window.removeEventListener('message', processMessage)
    }
  }, [onMessage])
}
