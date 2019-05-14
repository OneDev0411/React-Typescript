import Fetch from 'services/fetch'

export async function sendBulkEmail(email) {
  try {
    const data = {
      ...email,
      due_at: email.due_at || new Date()
    }

    const response = await new Fetch().post('/emails/individual').send(data)

    return response.body
  } catch (error) {
    throw error
  }
}