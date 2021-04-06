import Fetch from '../../../services/fetch'

export async function getContactsTags(users = []) {
  try {
    const payload =
      users.length > 0
        ? {
            users
          }
        : {}
    const response = await new Fetch().get('/contacts/tags').send(payload)

    return response.body
  } catch (error) {
    throw error
  }
}
