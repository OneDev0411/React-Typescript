import Fetch from '../../../services/fetch'

/**
 * Deleting contacts.
 * @param {array} contactIds The contacts ids array to be deleted.
 * @returns {object} Returns response - actually nothing. it returns 204.
 */

export default async function deleteContacts({ contactIds }) {
  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    throw new Error('Contacts id is required.')
  }

  try {
    return new Fetch().delete('/contacts/').send({ ids: contactIds })
  } catch (error) {
    throw error
  }
}
