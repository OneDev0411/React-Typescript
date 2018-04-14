import Fetch from '../../../services/fetch'

const defaultQuery = {
  limit: 10000,
  sorting_value: 'Update',
  'associations[]': ['user.last_seen_by']
}

export async function getContacts(query = defaultQuery) {
  try {
    const response = await new Fetch().get('/contacts').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
