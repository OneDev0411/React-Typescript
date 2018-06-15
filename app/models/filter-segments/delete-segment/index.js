import Fetch from '../../../services/fetch'

export async function deleteSegment(namespace, id) {
  try {
    const response = await new Fetch().delete(`/${namespace}/lists/${id}`)

    return response.body
  } catch (error) {
    throw error
  }
}
