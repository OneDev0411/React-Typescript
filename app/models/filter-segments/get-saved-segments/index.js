import Fetch from '../../../services/fetch'

export async function getSavedSegments(namespace, associations) {
  try {
    const response = await new Fetch()
      .get(`/${namespace}/lists`)
      .query({ associations })

    return response.body
  } catch (error) {
    throw error
  }
}
