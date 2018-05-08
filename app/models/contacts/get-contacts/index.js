import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function getContacts(start = 0, limit = 10000) {
  try {
    const response = await new Fetch()
      .get('/contacts')
      .query({ start })
      .query({ limit })
      .query({ sorting_value: 'Update' })
      .query({ 'associations[]': ['user.last_seen_by'] })
      .query(defaultQuery)

    return response.body
  } catch (error) {
    throw error
  }
}
