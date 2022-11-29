// TODO: Replace all usage of this file with react-router-dom@6/useNavigate after update
// https://gitlab.com/rechat/web/-/issues/2744#note_1158663484
import { useCallback } from 'react'

import { browserHistory } from 'react-router'

export interface Path {
  /**
   * A URL pathname, beginning with a /.
   */
  pathname: string

  /**
   * A URL search string, beginning with a ?.
   */
  search: string

  /**
   * A URL fragment identifier, beginning with a #.
   */
  hash: string
}
export type To = string | Partial<Path> | -1

export interface NavigateFunction {
  (
    to: To,
    options?: {
      replace?: boolean
      state?: any
      relative?: any
    }
  ): void
}

/**
 * A proxy hook to react-router-dom@6 useNavigate
 * @example <caption>browserHistory.push(pathname)</caption>
 * const navigate = useNavigate()
 * navigate(pathname)
 * @example <caption>browserHistory.replace(pathname)</caption>
 * const navigate = useNavigate()
 * navigate(pathname, {replace: true})
 * @example <caption>goTo(pathname)</caption>
 * const navigate = useNavigate()
 * navigate(pathname)
 * @example <caption>goTo(pathname, null, {q: 'search'}, {s: 'state'})</caption>
 * const navigate = useNavigate()
 * navigate({pathname, search: 'q=search'}, {state: {s: 'state'}})
 * @example <caption>window.history.back()</caption>
 * const navigate = useNavigate()
 * navigate(-1)
 * @returns Returns an imperative method for changing the location.
 */
export function useNavigate(): NavigateFunction {
  const navigate: NavigateFunction = useCallback((to, options) => {
    if (to === -1) {
      browserHistory.goBack()

      return
    }

    const historyAction = options?.replace
      ? browserHistory.replace
      : browserHistory.push

    if (typeof to === 'string') {
      historyAction(to)

      return
    }

    const pathname = to.pathname || browserHistory.getCurrentLocation().pathname

    const search = to.search
      ? to.search[0] === '?'
        ? to.search
        : `?${to.search}`
      : undefined

    const hash = to.hash
      ? to.hash[0] === '#'
        ? to.hash
        : `#${to.hash}`
      : undefined

    historyAction({
      pathname,
      search,
      hash,
      state: options?.state
    })
  }, [])

  return navigate
}
