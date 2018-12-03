import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(
  searchText = '',
  filter,
  query = {
    ...defaultQuery,
    order: '-created_at'
  },
  users
) {
  try {
    const payload = {}

    const q = encodeURIComponent(searchText.trim())

    const request = new Fetch().post('/contacts/filter').query(query)

    if (q.length > 0) {
      payload.query = q
    }

    if (Array.isArray(filter) && filter.length > 0) {
      payload.filter = filter
    }

    if (Array.isArray(users) && users.length) {
      request.query(`users[]=${users.join('&users[]=')}`)
    }

    request.send(payload)

    const response = await request

    return response.body
  } catch (error) {
    throw error
  }
}
