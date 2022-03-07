import { useCallback, useMemo } from 'react'

import { LocationDescriptor } from 'history'
import { browserHistory } from 'react-router'

type UseQueryParam = [string, (value: string) => void, () => void]

export function useQueryParamValue(
  name: string,
  defaultValue: string = ''
): string {
  const location = window.location

  const value = useMemo(
    () => new URLSearchParams(location.search).get(name),
    [location.search, name]
  )

  return decodeURIComponent(value || defaultValue)
}

function useQueryParamBase(
  historyAction: (path: LocationDescriptor) => void,
  name: string,
  defaultValue: string,
  deleteIfEmpty: boolean
): UseQueryParam {
  const value = useQueryParamValue(name, defaultValue)

  const setValue = useCallback(
    (newValue: string) => {
      const location = window.location

      if (!location.href) {
        return
      }

      const url = new URL(location.href)

      if ((deleteIfEmpty && !newValue) || newValue === defaultValue) {
        url.searchParams.delete(name)
      } else {
        url.searchParams.set(name, encodeURIComponent(newValue))
      }

      historyAction(url.pathname + url.search)
    },
    [deleteIfEmpty, defaultValue, historyAction, name]
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
export function useQueryParam(
  name: string,
  defaultValue: string = ''
): UseQueryParam {
  return useQueryParamBase(browserHistory.push, name, defaultValue, false)
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
export function useReplaceQueryParam(
  name: string,
  defaultValue: string = ''
): UseQueryParam {
  return useQueryParamBase(browserHistory.replace, name, defaultValue, false)
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
export function useAutoQueryParam(
  name: string,
  defaultValue: string = ''
): UseQueryParam {
  return useQueryParamBase(browserHistory.push, name, defaultValue, true)
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
export function useReplaceAutoQueryParam(
  name: string,
  defaultValue: string = ''
): UseQueryParam {
  return useQueryParamBase(browserHistory.replace, name, defaultValue, true)
}
