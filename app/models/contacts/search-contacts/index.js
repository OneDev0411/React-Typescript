import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(filter, query = defaultQuery) {
  if (!filter || typeof filter !== 'string') {
    throw new Error(`filter value is ${filter}.`)
  }

  const keywords = filter
    .trim()
    .split(' ')
    .map(i => `q[]=${encodeURIComponent(i)}`)
    .join('&')

  try {
    const response = await new Fetch()
      .post('/contacts/filter')
      .query(keywords)
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
