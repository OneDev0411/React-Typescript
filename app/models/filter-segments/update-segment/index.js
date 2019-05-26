import Fetch from '../../../services/fetch'

async function updateSegment(namespace, segment, query = {}) {
  try {
    const response = await new Fetch()
      .put(`/${namespace}/lists/${segment.id}`)
      .send(segment)
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}

export default updateSegment
