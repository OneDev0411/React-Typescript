import Fetch from '../../../services/fetch'

/**
 * Delete attributes to contacts
 * @param {Array} ids - array of contact ids
 * @returns Returns 204
 */

export async function deleteAttributesFromContacts(ids) {
  if (!Array.isArray(ids)) {
    throw new Error('Contact ids required.')
  }

  try {
    const response = await new Fetch({ stream: true })
      .delete('/contacts/attributes')
      .send({ ids })

    return response.body
  } catch (error) {
    throw error
  }
}
