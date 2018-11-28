import Fetch from '../../../services/fetch'

export async function getHistory() {
  try {
    const response = await new Fetch().get('/templates/instances')

    return response.body.data
  } catch (e) {
    throw e
  }
}
