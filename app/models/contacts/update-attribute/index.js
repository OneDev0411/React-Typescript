import Fetch from '../../../services/fetch'

/**
 * Update an added attribute of an existing contact.
 * @param {String} contactId The contact id that attributes should to update.
 * @param {String} attributeId The attribute id that must be update.
 * @param {Object} data The attribute data that must be update.
 * @returns {Object} Returns updated attribute.
 */

export async function updateAttribute(contactId, attributeId, data) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  if (!attributeId) {
    throw new Error('Attribute id is required!')
  }

  try {
    const response = await new Fetch()
      .put(`/contacts/${contactId}/attributes/${attributeId}`)
      .send(data)

    return response.body.data
  } catch (error) {
    throw error
  }
}
