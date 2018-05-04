import Fetch from '../../../services/fetch'
import { defaultQuery } from '../helpers/default-query'

const QUERY = `${defaultQuery}&limit=10000&sorting_value=Update&associations[]=user.last_seen_by`

export async function getContacts(query = QUERY) {
  try {
    const response = await new Fetch().get('/contacts').query(query)

    return response.body
  } catch (error) {
    throw error
  }
}
