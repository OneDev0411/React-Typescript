import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

const defaultOptions = {
  get: true,
  relax: true
}

/**
 * Create a new contacts.
 * @param {Array} contacts - Array of new contacts object.
 * @param {Object} options - The options of response form that
 * we wish receiving from server.
 * @returns {Array} Returns new contacts.
 */

export async function createContacts(
  contacts,
  options = defaultOptions,
  query = defaultQuery
) {
  if (!Array.isArray(contacts)) {
    throw new Error(`contacts is ${contacts}. It must be array of contacts.`)
  }

  if (contacts.length === 0) {
    throw new Error('contacts is empty!')
  }

  try {
    const response = await new Fetch({ stream: true })
      .post('/contacts')
      .send({ contacts, options })
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
