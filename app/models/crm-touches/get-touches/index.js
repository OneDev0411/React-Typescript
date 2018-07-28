import Fetch from '../../../services/fetch'

export async function getTouches(query = {}) {
  try {
    const response = await new Fetch().get('/crm/touches').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
