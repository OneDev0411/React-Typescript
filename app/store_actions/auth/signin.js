import signin from '../../models/auth/signin'
import * as actionsType from '../../constants/auth/signin'

const submitSigninForm = userInfo => (dispatch, getState) => {
  dispatch({
    type: actionsType.SIGNIN_REQUEST
  })

  return signin(userInfo).then(
    user => {
      dispatch({
        user,
        type: actionsType.SIGNIN_SUCCESS
      })
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
