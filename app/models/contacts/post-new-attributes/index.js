import Fetch from '../../../services/fetch'

/**
 * Adding new attributes to an existing contact.
 * @param {string} contactId The contact's id that attributes should to add it .
 * @param {array} attributes The new attributes that must be added.
 * @returns {object} Returns updated contact.
 */

export default async function postNewAttributes({
  contactId = '',
  attributes = []
}) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  if (attributes.length === 0) {
    throw new Error('There is not any attribute!')
  }

  try {
    const response = await new Fetch()
      .post(`/contacts/${contactId}/attributes`)
      .send({
        attributes
      })

    return response.body.data
  } catch (error) {
    throw error
  }
}
