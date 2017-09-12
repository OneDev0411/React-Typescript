import { browserHistory } from 'react-router'
import signin from '../../models/auth/signin'
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

      // const { id, email, first_name, last_name } = user
      // if (window.FS) {
      //   window.FS.identify(id, {
      //     email,
      //     displayName: `${first_name} ${last_name}`
      //   })
      // }
      // window.Intercom.signin({ user }, () => {})

      if (redirectTo) {
        browserHistory.push(redirectTo)
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
