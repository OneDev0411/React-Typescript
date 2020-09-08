import Fetch from '../../../services/fetch'

/**
 * un-park a contact
 * @param {string} contactId The contact's id that will be un-park.
 */

export async function unparkContact(contactId) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    const response = await new Fetch()
      .patch(`/contacts/${contactId}`)
      .send({ parked: false })

    return response.body
  } catch (error) {
    throw error
  }
}
