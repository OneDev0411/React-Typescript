import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-use'
import { browserHistory } from 'react-router'
import { LocationDescriptor } from 'history'

type UseQueryParam = [string, (value: string) => void, () => void]

export function useQueryParamValue(name: string): string {
  const location = useLocation()

  const value = useMemo(() => new URLSearchParams(location.search).get(name), [
    location.search,
    name
  ])

  return decodeURIComponent(value || '')
}

function useQueryParamBase(
  historyAction: (path: LocationDescriptor) => void,
  name: string,
  deleteIfEmpty: boolean
): UseQueryParam {
  const value = useQueryParamValue(name)

  const setValue = useCallback(
    (value: string) => {
      const url = new URL(window.location.href)

      if (deleteIfEmpty && !value) {
        url.searchParams.delete(name)
      } else {
        url.searchParams.set(name, encodeURIComponent(value))
      }

      historyAction(url.toString())
    },
    [historyAction, name, deleteIfEmpty]
  )

  const deleteValue = useCallback(() => {
    const url = new URL(window.location.href)

    url.searchParams.delete(name)

    historyAction(url.toString())
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
