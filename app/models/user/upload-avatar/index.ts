import Fetch from '../../../services/fetch'

export async function uploadUserProfileImage(file: Blob): Promise<IUser> {
  try {
    const response = await new Fetch()
      .upload('/users/self/profile_image_url', 'patch')
      .attach('media', file)

    return response.body.data
  } catch (error) {
    throw error
  }
}
