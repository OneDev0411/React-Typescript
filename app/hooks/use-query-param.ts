import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-use'
import { browserHistory } from 'react-router'
import { LocationDescriptor } from 'history'

type UseQueryParam = [string, (value: string) => void]

export function useQueryParamValue(name: string): string {
  const location = useLocation()

  const value = useMemo(
    () => new URLSearchParams(location.search).get(name),
    [location.search, name]
  )

  return decodeURIComponent(value || '')
}

function useQueryParamBase(
  historyAction: (path: LocationDescriptor) => void,
  name: string
): UseQueryParam {
  const value = useQueryParamValue(name)

  const setValue = useCallback(
    (value: string) => {
      const url = new URL(window.location.href)

      if (value) {
        url.searchParams.set(name, encodeURIComponent(value))
      } else {
        url.searchParams.delete(name)
      }

      historyAction.call(browserHistory, url.toString())
    },
    [historyAction, name]
  )

  return [value, setValue]
}

export function useQueryParam(name: string): UseQueryParam {
  return useQueryParamBase(browserHistory.push, name)
}

export function useReplaceQueryParam(name: string): UseQueryParam {
  return useQueryParamBase(browserHistory.replace, name)
}
