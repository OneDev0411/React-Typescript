import Fetch from '../../../services/fetch'

async function getSegments(namespace, query = {}) {
  try {
    const response = await new Fetch().get(`/${namespace}/lists`).query(query)

    return response.body
  } catch (error) {
    throw error
  }
}

export default getSegments
