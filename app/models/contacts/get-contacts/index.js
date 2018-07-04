import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function getContacts(start = 0, limit = 50) {
  const query = {
    start,
    limit,
    order: '-update_at',
    ...defaultQuery
  }

  try {
    const response = await new Fetch().get('/contacts').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
