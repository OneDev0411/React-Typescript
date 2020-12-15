import Fetch from '../../../services/fetch'
import { updateContactQuery } from '../helpers/default-query'

const DEFAULT_QUERY = {
  ...updateContactQuery,
  relax: true,
  activity: false
}

/**
 * Create a new contacts.
 * @param {Array} contacts - Array of new contacts object.
 */

export async function createContacts(contacts, query = DEFAULT_QUERY) {
  if (!Array.isArray(contacts)) {
    throw new Error(`contacts is ${contacts}. It must be array of contacts.`)
  }

  if (contacts.length === 0) {
    throw new Error('contacts is empty!')
  }

  try {
    const response = await new Fetch()
      .post('/contacts')
      .send({ contacts })
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
