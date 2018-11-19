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
    const keywords = searchText
      .trim()
      .split(' ')
      .map(i => `q[]=${encodeURIComponent(i)}`)
      .join('&')

    const request = new Fetch()
      .post(`/contacts/filter?${keywords}`)
      .query(query)

    if (Array.isArray(filter) && filter.length) {
      request.send({ filter })
    }

    if (Array.isArray(users) && users.length) {
      request.query(`users[]=${users.join('&users[]=')}`)
    }

    const response = await request

    return response.body
  } catch (error) {
    throw error
  }
}
