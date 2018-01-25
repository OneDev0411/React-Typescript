import { browserHistory } from 'react-router'
import signin from '../../models/auth/signin'
import getDefaultHomePage from '../../utils/get-default-home-page'
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

      const defaultHomePage = getDefaultHomePage(user)

      if (redirectTo && redirectTo.includes('http')) {
        browserHistory.push('/branch?waitingForRedirect')
        window.location.href = redirectTo

        return
      }

      browserHistory.push(redirectTo || defaultHomePage)
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
