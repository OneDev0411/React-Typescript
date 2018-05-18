import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'
import { normalizeContactAttribute } from '../../../store_actions/contacts/helpers/normalize-contacts'

export async function searchContacts(keyword, query = defaultQuery) {
  if (!keyword) {
    throw new Error('Keyword is required for query!')
  }

  try {
    const response = await new Fetch()
      .post('/contacts/filter')
      .query({ 'q[]': keyword })
      .query(query)

    return normalizeContactAttribute(response.body)
  } catch (error) {
    throw error
  }
}
