import edit from '../../models/user/edit'
import AppStore from '../../stores/AppStore'
import updateApp from '../../store_actions/data'
import * as actionsType from '../../constants/user'

const editUser = userInfo => async (dispatch, getState) => {
  dispatch({
    type: actionsType.EDIT_USER_REQUEST
  })

  try {
    const user = await edit(userInfo)
    const { data } = getState()
    const newAppData = {
      ...data,
      user
    }

    dispatch({
      user,
      type: actionsType.EDIT_USER_SUCCESS
    })

    dispatch({
      data: newAppData,
      type: 'UPDATE_APP'
    })

    AppStore.data = newAppData

    return user
  } catch ({ status }) {
    throw status
  }
}

export default editUser
