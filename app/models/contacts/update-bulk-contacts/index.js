import Fetch from '../../../services/fetch'

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

  try {
    const response = await new Fetch({ stream: true })
      .patch('/contacts')
      .send({ ids, attributes })

    return response.body
  } catch (error) {
    throw error
  }
}
