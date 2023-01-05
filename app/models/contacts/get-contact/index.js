import Fetch from '../../../services/fetch'
import { updateContactQuery } from '../helpers/default-query'

export async function getContact(
  contactId,
  query = updateContactQuery,
  signal
) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    const request = new Fetch().get(`/contacts/${contactId}`).query(query)

    signal?.addEventListener('abort', () => {
      request.abort()
    })

    const response = await request

    return response.body
  } catch (error) {
    throw error
  }
}
