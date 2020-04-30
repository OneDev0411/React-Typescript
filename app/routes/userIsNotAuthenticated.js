import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'

import { getUserDefaultHomepage } from '../utils/get-default-home-page'

const userIsNotAuthenticated = connectedRouterRedirect({
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

export default userIsNotAuthenticated
