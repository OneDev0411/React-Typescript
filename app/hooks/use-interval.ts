/**
 * Runs the given function with the given interval and handles cleanup on
 * unmount.
 *
 * IMPORTANT: it cleans previous interval and sets up a new one, each time a
 * new function is passed. So you usually want to wrap the passed fn into
 * a useCallback. Please also note that whenever fn or interval are changed
 * the interval is set from scratch, so you cannot count on the exact timings
 * when there are lots of change in fn or interval.
 *
 * @param fn
 * @param interval
 */
import { useEffect } from 'react'

export function useInterval(fn: () => any, interval: number) {
  useEffect(() => {
    const handle = setInterval(fn, interval)

    return () => clearInterval(handle)
  }, [fn, interval])
}
