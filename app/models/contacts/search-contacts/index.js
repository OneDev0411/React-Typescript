import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(
  searchText,
  filter,
  query = {
    ...defaultQuery,
    order: '-updated_at'
  }
) {
  try {
    const request = new Fetch().post('/contacts/filter').query(query)

    if (searchText) {
      const keywords = searchText
        .trim()
        .split(' ')
        .map(i => `q[]=${encodeURIComponent(i)}`)
        .join('&')

      request.query(keywords)
    }

    if (Array.isArray(filter) && filter.length) {
      request.send({ filter })
    }

    const response = await request

    return response.body
  } catch (error) {
    throw error
  }
}
