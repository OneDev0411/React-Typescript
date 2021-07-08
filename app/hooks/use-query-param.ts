import { useMemo } from 'react'
import { useLocation } from 'react-use'

type UseQueryParam = [string, (value: string) => void]

function useQueryParamValue(name: string): string {
  const location = useLocation()

  const value = useMemo(() => new URLSearchParams(location.search).get(name), [
    location.search,
    name
  ])

  return value || ''
}

export function useQueryParam(name: string): UseQueryParam {
  const value = useQueryParamValue(name)

  const setValue = (value: string) => {
    const url = new URL(window.location.href)

    url.searchParams.set(name, encodeURIComponent(value))

    // https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    window.history.pushState({}, '', url.toString())
  }

  return [value, setValue]
}

export function useReplaceQueryParam(name: string): UseQueryParam {
  const value = useQueryParamValue(name)

  const setValue = (value: string) => {
    const url = new URL(window.location.href)

    url.searchParams.set(name, encodeURIComponent(value))

    window.history.replaceState({}, '', url.toString())
  }

  return [value, setValue]
}
