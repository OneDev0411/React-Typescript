import { useCallback, useMemo } from 'react'

import { LocationDescriptor } from 'history'
import { browserHistory } from 'react-router'

type UseQueryParam = [string, (value: string) => void, () => void]

export function useQueryParamValue(name: string): string {
  const location = window.location

  const value = useMemo(
    () => new URLSearchParams(location.search).get(name),
    [location.search, name]
  )

  return decodeURIComponent(value || '')
}

function useQueryParamBase(
  historyAction: (path: LocationDescriptor) => void,
  name: string,
  deleteIfEmpty: boolean
): UseQueryParam {
  const value = useQueryParamValue(name)

  const setValue = useCallback(
    (newValue: string) => {
      const location = window.location

      if (!location.href) {
        return
      }

      const url = new URL(location.href)

      if (deleteIfEmpty && !newValue) {
        url.searchParams.delete(name)
      } else {
        url.searchParams.set(name, encodeURIComponent(newValue))
      }

      historyAction(url.pathname + url.search)
    },
    [historyAction, name, deleteIfEmpty]
  )

  const deleteValue = useCallback(() => {
    const location = window.location

    if (!location.href) {
      return
    }

    const url = new URL(location.href)

    url.searchParams.delete(name)

    historyAction(url.pathname + url.search)
  }, [historyAction, name])

  return [value, setValue, deleteValue]
}

/**
 * This hook provides the param value, a setter and a delete function for
 * managing the param.
 *
 * Please consider that it calls the `pushState` method under the hood to
 * insert a new state into the browser history.
 * @param name The param name
 * @returns [the param value, the setter function, the delete function]
 */
export function useQueryParam(name: string): UseQueryParam {
  return useQueryParamBase(browserHistory.push, name, false)
}

/**
 * This hook provides the param value, a setter and a delete function for
 * managing the param.
 *
 * Please consider that it calls the `replaceState` method under the hood to
 * replace the state on the browser history.
 * @param name The param name
 * @returns [the param value, the setter function, the delete function]
 */
export function useReplaceQueryParam(name: string): UseQueryParam {
  return useQueryParamBase(browserHistory.replace, name, false)
}

/**
 * This hook provides the param value, a setter and a delete function for
 * managing the param.
 *
 * Please consider that it calls the `pushState` method under the hood to insert
 * a new state into the browser history.
 *
 * Also, this hook deletes the param automatically if you pass an empty string.
 * @param name The param name
 * @returns [the param value, the setter function, the delete function]
 */
export function useAutoQueryParam(name: string): UseQueryParam {
  return useQueryParamBase(browserHistory.push, name, true)
}

/**
 * This hook provides the param value, a setter and a delete function for
 * managing the param.
 *
 * Please consider that it calls the `replaceState` method under the hood to
 * replace the state on the browser history.
 *
 * Also, this hook deletes the param automatically if you pass an empty string.
 * @param name The param name
 * @returns [the param value, the setter function, the delete function]
 */
export function useReplaceAutoQueryParam(name: string): UseQueryParam {
  return useQueryParamBase(browserHistory.replace, name, true)
}
