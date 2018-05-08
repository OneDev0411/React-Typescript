import Fetch from '../../../services/fetch'
import { defaultOptions, defaultQuery } from '../helpers/default-query'
import { normalizeContactAttribute } from '../../../store_actions/contacts/helpers/normalize-contacts'


export async function searchContacts(q, options = defaultOptions) {
  if (!q) {
    throw new Error('Keyword is required for query!')
  }

  try {
    const response = await new Fetch()
      .post('/contacts/filter')
      .query({ 'q[]': q })
      .query(defaultQuery)

    return normalizeContactAttribute(response.body)
  } catch (error) {
    throw error
  }
}
