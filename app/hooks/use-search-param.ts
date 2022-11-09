// TODO: Replace all usage of this file with react-router-dom@6/useSearchParam after update
// https://gitlab.com/rechat/web/-/issues/2744#note_1158663484
import { useCallback, useMemo } from 'react'

import { createSearchParams } from '@app/utils/create-search-params'

import { useNavigate } from './use-navigate'

export type SetURLSearchParams = (
  newSearchParams: Record<string, string>,
  navigateOpts?: {
    replace?: boolean
    state?: any
    relative?: any
  }
) => void

/**
 * A proxy hook to react-router-dom@6 useSearchParams
 * A convenient wrapper for reading and writing search parameters via the
 * URLSearchParams interface.
 * @example <caption>browserHistory.push(pathname)</caption>
 * const navigate = useSearchParams()
 * navigate(pathname)
 * @returns Returns an imperative method for changing the location.
 */
export function useSearchParams(): [URLSearchParams, SetURLSearchParams] {
  const navigate = useNavigate()
  const location = window.location

  const searchParams = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const setSearchParams = useCallback<SetURLSearchParams>(
    (newSearchParams, navigateOptions) => {
      navigate(
        {
          search: createSearchParams(newSearchParams)
        },
        navigateOptions
      )
    },
    [navigate]
  )

  return [searchParams, setSearchParams]
}
