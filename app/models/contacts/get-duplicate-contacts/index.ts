import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'
// import { DuplicateContacts } from '../get-contact-duplicate-contacts/types'

export async function getDuplicateContacts(
  customQuery?: object
): Promise<ApiResponseBody<any>> {
  const query = customQuery || defaultQuery

  try {
    const response = await new Fetch().get('/contacts/duplicates').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
