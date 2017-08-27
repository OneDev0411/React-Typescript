import { routerActions } from 'react-router-redux'
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'
import locationHelperBuilder from 'redux-auth-wrapper/history3/locationHelper'

const locationHelper = locationHelperBuilder({})

const userIsNotAuthenticated = connectedRouterRedirect({
  // This sends the user either to the query param route if we have one, or to the landing page if none is specified and the user is already logged in
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || '/dashboard/mls',
  // This prevents us from adding the query parameter when we send the user away from the login page
  allowRedirectBack: false,
  // Determine if the user is authenticated or not
  authenticatedSelector: ({ user }) => !Object.keys(user).length,
  // A nice display name for this check
  wrapperDisplayName: 'UserIsNotAuthenticated'
})

export default userIsNotAuthenticated
