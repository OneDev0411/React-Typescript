import { useCallback, useMemo, useRef } from 'react'

import { LocationDescriptor } from 'history'
import { isEqual } from 'lodash'
import { browserHistory } from 'react-router'

type ParamInputType = string | string[]

type UseQueryParam<T extends ParamInputType = string> = [
  T,
  (value: T) => void,
  () => void
]

export function useQueryParamValue<T extends ParamInputType = string>(
  name: string,
  defaultValue: T = '' as T
): T {
  const location = window.location

  const value = useMemo(() => {
    if (Array.isArray(defaultValue)) {
      const searchParamValue = new URLSearchParams(location.search).getAll(name)

      return (searchParamValue.length ? searchParamValue : defaultValue).map(
        decodeURIComponent
      )
    }

    return decodeURIComponent(
      new URLSearchParams(location.search).get(name) || (defaultValue as string)
    )
  }, [defaultValue, location.search, name])

  return value as T
}

export function useQueryParamBase<T extends ParamInputType = string>(
  historyAction: (path: LocationDescriptor) => void,
  name: string,
  defaultValue: T = '' as T,
  deleteIfEmpty: boolean
): UseQueryParam<T> {
  const value = useQueryParamValue(name, defaultValue)
  const defaultValueRef = useRef<T>(defaultValue)

  const setValue = useCallback(
    (newValue: T) => {
      const location = window.location

      if (!location.href) {
        return
      }

      const url = new URL(location.href)

      if (
        (deleteIfEmpty && !newValue.length) ||
        isEqual(newValue, defaultValueRef.current)
      ) {
        url.searchParams.delete(name)
      } else if (Array.isArray(newValue)) {
        url.searchParams.delete(name)
        newValue.forEach(v => {
          url.searchParams.append(name, encodeURIComponent(v))
        })
      } else {
        url.searchParams.set(name, encodeURIComponent(newValue as string))
      }

      historyAction(url.pathname + url.search)
    },
    [deleteIfEmpty, historyAction, name]
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
 * The default value will not appear on the URL
 * @param name The param name
 * @param defaultValue The param default value
 * @returns [the param value, the setter function, the delete function]
 */
export function useQueryParam<T extends ParamInputType = string>(
  name: string,
  defaultValue: T = '' as T
): UseQueryParam<T> {
  return useQueryParamBase(browserHistory.push, name, defaultValue, false)
}

/**
 * This hook provides the param value, a setter and a delete function for
 * managing the param.
 *
 * Please consider that it calls the `replaceState` method under the hood to
 * replace the state on the browser history.
 * The default value will not appear on the URL.
 * @param name The param name
 * @param defaultValue The param default value
 * @returns [the param value, the setter function, the delete function]
 */
export function useReplaceQueryParam<T extends ParamInputType = string>(
  name: string,
  defaultValue: T = '' as T
): UseQueryParam<T> {
  return useQueryParamBase(browserHistory.replace, name, defaultValue, false)
}

/**
 * This hook provides the param value, a setter and a delete function for
 * managing the param.
 *
 * Please consider that it calls the `pushState` method under the hood to insert
 * a new state into the browser history.
 *
 * The default value will not appear on the URL.
 * Also, this hook deletes the param automatically if you pass an empty string.
 * @param name The param name
 * @param defaultValue The param default value
 * @returns [the param value, the setter function, the delete function]
 */
export function useAutoQueryParam<T extends ParamInputType = string>(
  name: string,
  defaultValue: T = '' as T
): UseQueryParam<T> {
  return useQueryParamBase(browserHistory.push, name, defaultValue, true)
}

/**
 * This hook provides the param value, a setter and a delete function for
 * managing the param.
 *
 * Please consider that it calls the `replaceState` method under the hood to
 * replace the state on the browser history.
 *
 * The default value will not appear on the URL.
 * Also, this hook deletes the param automatically if you pass an empty string.
 * @param name The param name
 * @param defaultValue The param default value
 * @returns [the param value, the setter function, the delete function]
 */
export function useReplaceAutoQueryParam<T extends ParamInputType = string>(
  name: string,
  defaultValue: T = '' as T
): UseQueryParam<T> {
  return useQueryParamBase(browserHistory.replace, name, defaultValue, true)
}
