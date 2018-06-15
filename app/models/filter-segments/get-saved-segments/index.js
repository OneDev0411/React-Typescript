import Fetch from '../../../services/fetch'

export async function getSavedSegments(namespace) {
  try {
    const response = await new Fetch().get(`/${namespace}/lists`)

    return response.body
  } catch (error) {
    throw error
  }
}
