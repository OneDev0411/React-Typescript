import Fetch from '../../../services/fetch'

/**
 * upload user profile image
 * @param {object}
 */
const uploadProfileImage = async file => {
  try {
    const response = await new Fetch()
      .upload('/users/self/profile_image_url', 'patch')
      .attach('media', file)

    return response.body.data
  } catch ({ status }) {
    throw status
  }
}

export default uploadProfileImage
