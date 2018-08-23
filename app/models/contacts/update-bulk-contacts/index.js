import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

/**
 * Upserting attributes to contacts
 * @param {Array} updatedContacts - array of contacts with attributes which should be updated
 * @param {Object} attributes - array of attributes to be add or update
 * @returns Returns 204
 */

export async function upsertAttributesToContacts(updatedContacts) {
  if (!Array.isArray(updatedContacts)) {
    throw new Error('updated contacts is required.')
  }

  let query = {}

  if (updatedContacts.length < 50) {
    query = {
      ...defaultQuery,
      get: true
    }
  }

  try {
    const response = await new Fetch()
      .patch('/contacts')
      .query(query)
      .send({ contacts: updatedContacts })

    if (updatedContacts.length < 50) {
      return response.body
    }

    return { data: [] }
  } catch (error) {
    throw error
  }
}
