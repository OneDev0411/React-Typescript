import Fetch from '../../../services/fetch'

export async function getContactsTags(user_filter = []) {
  try {
    const response = await new Fetch()
      .get('/contacts/tags')
      .query({ 'users[]': user_filter })

    return response.body
  } catch (error) {
    throw error
  }
}
