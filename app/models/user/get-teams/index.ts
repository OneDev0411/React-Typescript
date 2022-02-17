import Fetch from '../../../services/fetch'
import { BRAND_USERS_QUERY } from '../../brand/helpers/default-query'

export async function getTeams(fetchMembers = true): Promise<IUserTeam[]> {
  try {
    const requestInstance = new Fetch().get('/users/self/roles')

    if (fetchMembers) {
      requestInstance.query(BRAND_USERS_QUERY)
    }

    const response = await requestInstance

    return response.body.data
  } catch (e) {
    throw e
  }
}
