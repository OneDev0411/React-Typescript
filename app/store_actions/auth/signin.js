import { browserHistory } from 'react-router'

import { setupSentry } from 'services/sentry'

import * as actionsType from '../../constants/auth/signin'
import signin from '../../models/auth/signin'
import getUser from '../../models/user/get-user'

const submitSigninForm =
  (loginData, redirectTo, userId) => (dispatch, getState) => {
    dispatch({
      type: actionsType.SIGNIN_REQUEST
    })

    return signin(loginData).then(
      async user => {
        try {
          if (!user.id) {
            const userData = await getUser(userId, user.access_token)

            user = {
              ...user,
              ...userData
            }
          }

          dispatch({
            user,
            type: actionsType.SIGNIN_SUCCESS
          })

          const { brand } = getState()

          setupSentry(user, brand)

          if (redirectTo) {
            if (redirectTo.includes('http')) {
              browserHistory.push('/branch?waitingForRedirect')
              window.location.href = redirectTo

              return
            }

            browserHistory.push(redirectTo)
          }
        } catch (error) {
          console.log(error)
          throw error
        }
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
