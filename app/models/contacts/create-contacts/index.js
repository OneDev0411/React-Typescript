import Fetch from '../../../services/fetch'

const defaultOptions = {
  get: true, // not works
  relax: true
}

/**
 * Create a new contacts.
 * @param {Array} contacts - Array of new contacts object.
 * @param {Object} options - The options of response form that
 * we wish receiving from server.
 * @returns {Array} Returns new contacts.
 */

export async function createContacts(contact, options = defaultOptions) {
  const contacts = Array.isArray(contact) ? contact : [contact]

  if (contacts.length === 0) {
    throw new Error('contacts is empty!')
  }

  try {
    const response = await new Fetch()
      .post('/contacts')
      .send({ contacts, options })

    return response.body
  } catch (error) {
    throw error
  }
}
