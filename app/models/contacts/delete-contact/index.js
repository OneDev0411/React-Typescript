import Fetch from '../../../services/fetch'

/**
 * Deleting a contact.
 * @param {string} contactId The contact's id.
 * @returns {object} Returns response - actually nothing. it returns 204.
 */

export default async function deleteContact({ contactId }) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    return new Fetch().delete(`/contacts/${contactId}`)
  } catch (error) {
    throw error
  }
}
