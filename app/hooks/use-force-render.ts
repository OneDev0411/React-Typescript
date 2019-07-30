import { useCallback, useState } from 'react'

/**
 * Returns a function that causes a re-render whenever it's called.
 * The function is the same across renders
 *
 * CAUTION: Valid use cases are so rare.
 */
export function useForceRender() {
  const [, setNonce] = useState(true)

  return useCallback(() => {
    setNonce(nonce => !nonce)
  }, [])
}
