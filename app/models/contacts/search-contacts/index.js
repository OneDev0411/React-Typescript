import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function searchContacts(filter, query = defaultQuery) {
  const keywords =
    typeof filter === 'string'
      ? filter
          .trim()
          .split(' ')
          .map(i => `q[]=${encodeURIComponent(i)}`)
          .join('&')
      : ''

  try {
    const response = await new Fetch()
      .post('/contacts/filter')
      .send({
        filter
      })
      .query(query)
      .query(keywords)

    return response.body
  } catch (error) {
    throw error
  }
}
