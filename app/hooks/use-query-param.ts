import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-use'
import { browserHistory } from 'react-router'

type UseQueryParam = [string, (value: string) => void, () => void]

interface UseQueryParamOptions {
  deleteEmptyParam?: boolean // Delete the query param if the value is empty
  replaceMode?: boolean // Decide about the updating method
}

export function useQueryParamValue(name: string): string {
  const location = useLocation()

  const value = useMemo(
    () => new URLSearchParams(location.search).get(name),
    [location.search, name]
  )

  return decodeURIComponent(value || '')
}

export function useQueryParam(
  name: string,
  options: UseQueryParamOptions = { deleteEmptyParam: true, replaceMode: false }
): UseQueryParam {
  const value = useQueryParamValue(name)

  const historyAction = !options.replaceMode
    ? browserHistory.push
    : browserHistory.replace

  const setValue = useCallback(
    (value: string) => {
      const url = new URL(window.location.href)

      url.searchParams.set(name, encodeURIComponent(value))

      historyAction.call(browserHistory, url.toString())
    },
    [historyAction, name]
  )

  const deleteValue = useCallback(() => {
    const url = new URL(window.location.href)

    url.searchParams.delete(name)

    historyAction.call(browserHistory, url.toString())
  }, [historyAction, name])

  const setOrDeleteValue = useCallback(
    (value: string) => {
      if (options.deleteEmptyParam && !value) {
        deleteValue()
      } else {
        setValue(value)
      }
    },
    [options.deleteEmptyParam, deleteValue, setValue]
  )

  return [value, setOrDeleteValue, deleteValue]
}
