import { browserHistory } from 'react-router'
import AppStore from '../../stores/AppStore'
import signin from '../../models/auth/signin'
import updateApp from '../../store_actions/data'
import * as actionsType from '../../constants/auth/signin'

const submitSigninForm = userInfo => (dispatch, getState) => {
  dispatch({
    type: actionsType.SIGNIN_REQUEST
  })

  return signin(userInfo).then(
    user => {
      const { data } = getState()
      const newAppData = {
        ...data,
        user
      }

      dispatch({
        user,
        type: actionsType.SIGNIN_SUCCESS
      })

      dispatch({
        data: newAppData,
        type: 'UPDATE_APP'
      })

      AppStore.data = newAppData

      // const { id, email, first_name, last_name } = user
      // if (window.FS) {
      //   window.FS.identify(id, {
      //     email,
      //     displayName: `${first_name} ${last_name}`
      //   })
      // }
      // window.Intercom.signin({ user }, () => {})

      browserHistory.push('/dashboard/mls')
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
