import Fetch from '../../../services/fetch'

async function createSegment(namespace, segment, query = {}) {
  try {
    const response = await new Fetch()
      .post(`/${namespace}/lists`)
      .send(segment)
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}

export default createSegment
