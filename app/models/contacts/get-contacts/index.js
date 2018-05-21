import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function getContacts(start = 0, limit = 50) {
  const query = {
    start,
    limit,
    sorting_value: 'update',
    associations: [...defaultQuery.associations, 'user.last_seen_by']
  }

  try {
    const response = await new Fetch().get('/contacts').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
