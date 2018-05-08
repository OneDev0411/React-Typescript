import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

/**
 * Adding new attributes to an existing contact.
 * @param {string} contactId The contact's id that attributes should to add it .
 * @param {array} attributes The new attributes that must be added.
 * @returns {object} Returns updated contact.
 */

export async function addAttributes(
  contactId,
  attributes,
  query = defaultQuery
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
      .post(`/contacts/${contactId}/attributes`)
      .send({
        attributes
      })
      .query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
