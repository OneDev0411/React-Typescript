import Fetch from '../../services/fetch'

import DEFAULT_QUERY from './helpers/default-query'

export async function getBrandById(id, query = DEFAULT_QUERY) {
  if (!id) {
    throw new Error(`The brand id must be a UUID. ${id}`)
  }

  try {
    const response = await new Fetch().get(`/brands/${id}`).query(query)

    return response.body.data
  } catch (error) {
    throw error
  }
}
