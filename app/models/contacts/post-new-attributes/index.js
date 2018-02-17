import Fetch from '../../../services/fetch'

/**
 * Add new attributes.
 * @param {string} contactId The contact id that attributes should to add it .
 * @param {array} attributes The contact id that attributes should to add it .
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
