import Fetch from '../../../services/fetch'

export async function getContactsTags() {
  try {
    const response = await new Fetch().get('/contacts/tags')

    return response.body
  } catch (error) {
    throw error
  }
}
