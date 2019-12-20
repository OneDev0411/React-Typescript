import { useCallback, useRef, useState } from 'react'

/**
 * TODO: docs
 */
export function useAsyncValue<T, E = any>() {
  const [value, setValue] = useState<T | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<E | null>(null)
  const lastPromiseRef = useRef<Promise<any> | null>(null)

  const setValueAsync = useCallback(async (promise: Promise<T>) => {
    lastPromiseRef.current = promise
    setLoading(true)
    setError(null)

    try {
      const value = await promise

      if (lastPromiseRef.current === promise) {
        setValue(value)
      }
    } catch (e) {
      if (lastPromiseRef.current === promise) {
        setError(e)
      }
    } finally {
      if (lastPromiseRef.current === promise) {
        setLoading(false)
      }
    }
  }, [])

  const result = [setValueAsync, value, loading, error]

  return result as [
    typeof setValueAsync,
    typeof value,
    typeof loading,
    typeof error
  ]
}
