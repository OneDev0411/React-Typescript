import { browserHistory } from 'react-router'
import signin from '../../models/auth/signin'
import { hasUserAccess, getUserRoles } from '../../utils/user-acl'
import * as actionsType from '../../constants/auth/signin'

const submitSigninForm = (userInfo, redirectTo) => (dispatch, getState) => {
  dispatch({
    type: actionsType.SIGNIN_REQUEST
  })

  return signin(userInfo).then(
    user => {
      dispatch({
        user,
        type: actionsType.SIGNIN_SUCCESS
      })

      // set user data for sentry
      if (window.Raven) {
        const { email, id } = user
        const { brand } = getState()

        const userData = {
          id,
          email,
          brand: brand && {
            id: brand.id,
            name: brand.name
          }
        }

        window.Raven.setUserContext(userData)
      }

      console.log(redirectTo)

      if (redirectTo && redirectTo.includes('http')) {
        browserHistory.push('/branch?waitingForRedirect')
        window.location.href = redirectTo

        return
      }

      let defaultRedirect = '/dashboard/mls'
      const roles = getUserRoles(user)
      const hasDealsPermission = roles.includes('Deals')
      const hasBackOfficePermission = roles.includes('BackOffice')

      if (hasDealsPermission || hasBackOfficePermission) {
        defaultRedirect = '/dashboard/deals'
      }

      browserHistory.push(redirectTo || defaultRedirect)
    },
    error => {
      dispatch({
        error,
        type: actionsType.SIGNIN_FAILURE
      })
    }
  )
}

export default submitSigninForm
