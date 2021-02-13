import { useEffect } from 'react'

function useSyncMapProp<T>(setter?: (value: T) => void, value?: T) {
  useEffect(() => {
    if (value) {
      setter?.(value)
    }
  }, [value, setter])
}

export default useSyncMapProp
