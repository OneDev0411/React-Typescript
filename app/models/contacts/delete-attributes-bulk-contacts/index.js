import Fetch from '../../../services/fetch'

/**
 * Delete attributes to contacts
 * @param {Array} ids - array of contact ids
 * @returns Returns 204
 */

export async function deleteAttributesFromContacts(ids) {
  if (!Array.isArray(ids)) {
    throw new Error('Attribute ids required.')
  }

  try {
    return new Fetch().delete('/contacts/attributes').send({ ids })
  } catch (error) {
    throw error
  }
}
