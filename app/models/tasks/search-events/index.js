import Fetch from '../../../services/fetch'

export async function searchEvents(query = {}) {
  try {
    const response = await new Fetch().get('/crm/tasks/search').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
