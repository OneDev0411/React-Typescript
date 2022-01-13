import Fetch from '../../../services/fetch'

/**
 * @param {string} tag
 */
export async function createContactsTags(tag) {
  try {
    const response = await new Fetch().post('/contacts/tags').send({ tag })

    return response.body
  } catch (error) {
    throw error
  }
}
