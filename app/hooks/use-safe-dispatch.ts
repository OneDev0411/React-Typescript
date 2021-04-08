import { useLayoutEffect, useRef, useCallback } from 'react'

type Func = (...args: any) => any

/**
 * A wrapper to make sure the target function is callable only when
 * the component mounted and did not unmount yet.
 * @param dispatch target function
 */
function useSafeDispatch<T extends Func = Func>(dispatch: T) {
  const mounted = useRef(false)

  useLayoutEffect(() => {
    mounted.current = true

    return () => {
      mounted.current = false
    }
  }, [])

  return useCallback<(...args: Parameters<T>) => ReturnType<T> | undefined>(
    (...args) => {
      if (mounted.current) {
        return dispatch(...(args as any))
      }
    },
    [dispatch]
  )
}

export default useSafeDispatch
