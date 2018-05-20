import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'
import { normalizeContactAttribute } from '../../../store_actions/contacts/helpers/normalize-contacts'

export async function searchContacts(filter, query = defaultQuery) {
  if (!filter || typeof filter !== 'string') {
    throw new Error(`filter value is ${filter}.`)
  }

  const keywords = query
    .trim()
    .split(' ')
    .map(i => `q[]=${i}`)
    .join('&')

  try {
    const response = await new Fetch()
      .post('/contacts/filter')
      .query(keywords)
      .query(query)

    return normalizeContactAttribute(response.body)
  } catch (error) {
    throw error
  }
}
