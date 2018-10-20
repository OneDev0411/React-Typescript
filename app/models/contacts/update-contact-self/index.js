import Fetch from '../../../services/fetch'
import { updateContactQuery } from '../helpers/default-query'

/**
 * Updating a contact self.
 * @param {string} contactId The contact's id that will be updated.
 * @param {array} body The fields that shoud be update.
 * @returns {object} Returns updated contact.
 */

export async function updateContactSelf(
  contactId,
  body,
  query = updateContactQuery
) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  if (!body) {
    throw new Error('Request body is required.')
  }

  try {
    const response = await new Fetch()
      .patch(`/contacts/${contactId}`)
      .send(body)
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
