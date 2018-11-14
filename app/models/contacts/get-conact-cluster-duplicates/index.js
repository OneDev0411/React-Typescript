import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

export async function fetchContactDuplicate(id) {
  try {
    const response = await new Fetch()
      .get(`/contacts/${id}/duplicates`)
      .query(defaultQuery)

    return response.body
  } catch (error) {
    throw error
  }
}
