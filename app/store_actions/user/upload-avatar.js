import upload from '../../models/user/upload-avatar'
import * as actionsType from '../../constants/user'

const uploadAvatar = image => async dispatch => {
  dispatch({
    type: actionsType.UPLOAD_AVATAR_REQUEST
  })

  try {
    const user = await upload(image)

    dispatch({
      user,
      type: actionsType.UPLOAD_AVATAR_SUCCESS
    })

    return user
  } catch ({ status }) {
    throw status
  }
}

export default uploadAvatar
