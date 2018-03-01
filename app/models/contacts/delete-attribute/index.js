import Fetch from '../../../services/fetch'

/**
 * Deleting an attribute from existing contact.
 * @param {string} contactId The contact's id.
 * @param {string} attributes The new attribute's id that must be deleted.
 * @returns {object} Returns updated contact.
 */

export default async function postNewAttributes({
  contactId = '',
  attributeId = ''
}) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  if (!attributeId) {
    throw new Error('Attribute id is required.')
  }

  try {
    const response = await new Fetch().delete(
      `/contacts/${contactId}/attributes/${attributeId}`
    )

    return response.body.data
  } catch (error) {
    throw error
  }
}
