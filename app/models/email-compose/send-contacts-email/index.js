import Fetch from '../../../services/fetch'

export async function sendContactsEmail(emails, from) {
  try {
    const response = await new Fetch().post('/contacts/emails').send({
      emails,
      from
    })

    return response.body
  } catch (error) {
    throw error
  }
}
