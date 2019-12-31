import Fetch from '../../../services/fetch'
import { DuplicateContacts } from '../get-contact-duplicate-contacts/index'

export async function getDuplicateContacts(): Promise<DuplicateContacts[]> {
  try {
    const response = await new Fetch().get('/contacts/duplicates')

    return response.body.data
  } catch (error) {
    throw error
  }
}
