import Fetch from '../../../services/fetch'

export async function getTemplates() {
  try {
    const response = await new Fetch().get('/templates')

    return response.body.data
  } catch (e) {
    throw e
  }
}
