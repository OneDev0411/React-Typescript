import * as actionsType from 'constants/user'
import { uploadUserProfileImage } from 'models/user/upload-avatar'

export const uploadUserAvatarAction = image => async dispatch => {
  dispatch({
    type: actionsType.UPLOAD_AVATAR_REQUEST
  })

  try {
    const user = await uploadUserProfileImage(image)

    dispatch({
      user,
      type: actionsType.UPLOAD_AVATAR_SUCCESS
    })

    return user
  } catch ({ status }) {
    throw status
  }
}
