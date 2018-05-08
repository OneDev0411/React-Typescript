import Fetch from '../../../services/fetch'

/**
 * Create a new contact.
 * @param {object} contact The new contact data.
 * @returns {array} Returns new contact.
 */

export default async function postNewContact(contact = {}) {
  if (Object.keys(contact).length === 0) {
    throw new Error('New contact has not any data.')
  }

  const contacts = Array.isArray(contact) ? contact : [contact]

  try {
    const response = await new Fetch().post('/contacts').send({ contacts })

    return response.body.data
  } catch (error) {
    throw error
  }
}
