import { useCallback, useEffect } from 'react'

/**
 * Calls a callback when the page is navigated by browser
 * back button and the state of the page is loaded from
 * [back-forward cache](https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/1.5/Using_Firefox_1.5_caching)
 * More information
 * https://stackoverflow.com/a/13123626/1493081
 */
export function useOnRestoredFromPersistedState(callback, deps) {
  const cb = useCallback(callback, deps)

  useEffect(() => {
    window.addEventListener('pageshow', event => {
      if (event.persisted) {
        cb()
      }
    })
  }, [cb])
}
