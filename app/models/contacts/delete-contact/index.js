import Fetch from '../../../services/fetch'

/**
 * Deleting contacts.
 * @param {array} ids The contacts ids array to be deleted.
 * @returns {object} Returns response - actually nothing. it returns 204.
 */

export async function deleteContacts(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error('Contacts id is required.')
  }

  try {
    return new Fetch().delete('/contacts/').send({ ids })
  } catch (error) {
    throw error
  }
}
