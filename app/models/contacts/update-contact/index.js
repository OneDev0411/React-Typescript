import Fetch from '../../../services/fetch'
import { updateContactQuery } from '../helpers/default-query'

/**
 * Updating a contact (its attributes).
 * @param {string} contactId The contact's id that will be updated.
 * @param {array} attributes The attributes that must be updated.
 * @returns {object} Returns updated contact.
 */

export async function updateContact(
  contactId,
  attributes,
  query = updateContactQuery
) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  if (!Array.isArray(attributes)) {
    throw new Error('Attribute is invalid!')
  }

  if (attributes.length === 0) {
    throw new Error('Attribute is empty!')
  }

  try {
    const response = await new Fetch()
      .patch(`/contacts/${contactId}`)
      .send({
        attributes
      })
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
