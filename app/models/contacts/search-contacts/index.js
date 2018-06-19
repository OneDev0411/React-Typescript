import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(filter, query = defaultQuery) {
  try {
    const request = new Fetch().post('/contacts/filter').query(query)

    if (typeof filter === 'string') {
      const keywords = filter
        .trim()
        .split(' ')
        .map(i => `q[]=${encodeURIComponent(i)}`)
        .join('&')

      request.query(keywords)
    } else {
      request.send({ filter })
    }

    const response = await request

    return response.body
  } catch (error) {
    throw error
  }
}
