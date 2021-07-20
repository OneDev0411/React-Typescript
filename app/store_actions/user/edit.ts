import * as actionsType from '../../constants/user'
import edit from '../../models/user/edit'

const editUser = (userInfo: IUserInput) => async dispatch => {
  dispatch({
    type: actionsType.EDIT_USER_REQUEST
  })

  try {
    const user = await edit(userInfo)

    dispatch({
      user,
      type: actionsType.EDIT_USER_SUCCESS
    })

    return user
  } catch (error) {
    throw error
  }
}

export default editUser
