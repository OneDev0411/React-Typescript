import { useEffect } from 'react'

import usePrevious from 'react-use/lib/usePrevious'

export function useOnToggledOn(value: boolean, cb: () => void) {
  const wasOpen = usePrevious(value)

  useEffect(() => {
    if (value && !wasOpen) {
      cb()
    }
  }, [cb, value, wasOpen])
}

export function useOnToggledOff(value: boolean, cb: () => void) {
  const wasOpen = usePrevious(value)

  useEffect(() => {
    if (!value && wasOpen) {
      cb()
    }
  }, [cb, value, wasOpen])
}
