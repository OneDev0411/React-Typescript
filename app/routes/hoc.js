import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-use'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'

import { selectUserIsSignedIn } from 'selectors/user'
import { goTo } from 'utils/go-to'

import { getUserDefaultHomepage } from '../utils/get-default-home-page'

export const withGuest = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: (state, { location: { query = {}, locationState = {} } }) => {
    const { redirectTo } = query || locationState

    return redirectTo || getUserDefaultHomepage(state.user)
  },
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // Determine if the user is authenticated or not
  authenticatedSelector: ({ user }) => !user,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

export function withSignedInUser() {
  return ({ children }) => {
    const isSignedIn = useSelector(selectUserIsSignedIn)
    const location = useLocation()
    const redirectTo = `/signIn?redirectTo=${location.pathname}`

    useEffect(() => {
      if (!isSignedIn) {
        goTo(redirectTo)
      }
    }, [isSignedIn, redirectTo])

    return isSignedIn ? children : null
  }
}
