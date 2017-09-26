import upload from '../../models/user/upload-cover-image'
import * as actionsType from '../../constants/user'

const uploadCoverImage = image => async (dispatch, getState) => {
  dispatch({
    type: actionsType.UPLOAD_COVER_IMAGE_REQUEST
  })

  try {
    const user = await upload(image)

    dispatch({
      user,
      type: actionsType.UPLOAD_COVER_IMAGE_SUCCESS
    })

    return user
  } catch (error) {
    throw error
  }
}

export default uploadCoverImage
