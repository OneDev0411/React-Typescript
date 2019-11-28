import { useRef } from 'react'

/**
 * Runs the callback only on the first render.
 * Note that it differs from a simple useEffect with an empty deps array,
 * in that it runs the callback right away, not after render.
 * @param callback
 * @returns the returned value from callback
 */
export function useInitializer<T extends (...args: any) => any>(callback: T) {
  const initializedRef = useRef(false)
  const returnValueRef = useRef<ReturnType<typeof callback>>(
    undefined as ReturnType<typeof callback>
  )

  if (!initializedRef.current) {
    initializedRef.current = true

    returnValueRef.current = callback()
  }

  return returnValueRef.current
}
