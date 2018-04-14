import Fetch from '../../../services/fetch'

export async function getContact(contactId) {
  if (!contactId) {
    throw new Error('Contact id is required.')
  }

  try {
    const response = await new Fetch().get(`/contacts/${contactId}`)

    return response.body
  } catch (error) {
    throw error
  }
}
