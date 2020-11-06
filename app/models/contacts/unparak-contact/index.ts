import Fetch from '../../../services/fetch'

/**
 * un-park a contact
 * @param {UUID[]} contacts The list of contacts id for un-parking
 */

export const unparkContact = async (contacts: UUID[]) => {
  if (!Array.isArray(contacts) || contacts.length === 0) {
    throw new Error('Contact ids is required.')
  }

  const payload = contacts.map(id => ({
    id,
    parked: false
  }))

  try {
    const response = await new Fetch()
      .patch('/contacts')
      .send({ contacts: payload })

    return response.body
  } catch (error) {
    throw error
  }
}
