import Fetch from '../../../services/fetch'

export async function updateSegment(namespace, segment) {
  try {
    const response = await new Fetch()
      .put(`/${namespace}/lists/${segment.id}`)
      .send(segment)

    return response.body
  } catch (error) {
    throw error
  }
}
