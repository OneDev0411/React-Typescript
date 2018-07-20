import Fetch from '../../../services/fetch'

export async function sendContactsEmail(emails) {
  try {
    const response = await new Fetch().post('/contacts/emails').send({
      emails
    })

    return response.body
  } catch (error) {
    throw error
  }
}
