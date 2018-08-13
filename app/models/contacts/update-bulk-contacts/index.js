import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

/**
 * Upserting attributes to contacts
 * @param {Array} ids - array of contact ids
 * @param {Object} attributes - array of attributes to be add or update
 * @returns Returns 204
 */

export async function upsertAttributesToContacts(ids, attributes) {
  if (!Array.isArray(ids)) {
    throw new Error('Contact ids required.')
  }

  if (!Array.isArray(attributes)) {
    throw new Error('Attributes invalid!')
  }

  let query = {}

  if (ids.length < 50) {
    query = {
      ...defaultQuery,
      get: true
    }
  }

  try {
    const response = await new Fetch({ stream: true })
      .patch('/contacts')
      .query(query)
      .send({ ids, attributes })

    if (ids.length < 50) {
      return response.body
    }

    return { data: [] }
  } catch (error) {
    throw error
  }
}
