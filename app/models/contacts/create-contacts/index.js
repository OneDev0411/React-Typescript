import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

const defaultOptions = {
  get: true, // not works
  relax: true
}

/**
 * Create a new contacts.
 * @param {array} contacts Array of new contacts object.
 * @param {object} options The options of response form that
 * we wish receiving from server.
 * @returns {array} Returns new contacts.
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
    const response = await new Fetch()
      .post('/contacts')
      .send({ contacts, options })
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
