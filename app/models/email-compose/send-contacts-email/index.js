import Fetch from '../../../services/fetch'

export async function sendContactsEmail(email) {
  try {
    const response = await new Fetch().post('/contacts/emails').send(email)

    return response.body
  } catch (error) {
    throw error
  }
}
