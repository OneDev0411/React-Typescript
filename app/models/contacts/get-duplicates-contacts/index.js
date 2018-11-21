import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function getDuplicatesContacts() {
  try {
    const response = await new Fetch()
      .get('/contacts/duplicates')
      .query(defaultQuery)

    return response.body
  } catch (error) {
    throw error
  }
}
