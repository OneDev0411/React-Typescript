import Fetch from '../../../services/fetch'

export async function createSegment(namespace, segment) {
  try {
    const response = await new Fetch().post(`/${namespace}/lists`).send(segment)

    return response.body
  } catch (error) {
    throw error
  }
}
