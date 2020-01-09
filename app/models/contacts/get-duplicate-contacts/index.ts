import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'
import { DuplicateContacts } from '../get-contact-duplicate-contacts/types'

export async function getDuplicateContacts(): Promise<DuplicateContacts[]> {
  try {
    const response = await new Fetch()
      .get('/contacts/duplicates')
      .query(defaultQuery)

    return response.body.data
  } catch (error) {
    throw error
  }
}
