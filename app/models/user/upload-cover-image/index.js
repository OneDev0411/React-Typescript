import Fetch from '../../../services/fetch'

/**
 * upload user cover image
 * @param {object}
 */
const uploadCoverImage = async file => {
  try {
    const response = await new Fetch()
      .upload('/users/self/cover_image_url', 'patch')
      .attach('media', file)

    return response.body.data
  } catch (error) {
    return error
  }
}

export default uploadCoverImage
