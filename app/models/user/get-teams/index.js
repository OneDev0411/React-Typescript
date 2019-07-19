import Fetch from '../../../services/fetch'
import { BRAND_USERS_QUERY } from '../../brand/helpers/default-query'

export async function getTeams(user = {}, fetchMembers = true) {
  const { access_token } = user

  try {
    const fetchTeams = new Fetch().get('/users/self/roles')

    if (access_token) {
      fetchTeams.set({ Authorization: `Bearer ${access_token}` })
    }

    if (fetchMembers) {
      fetchTeams.query(BRAND_USERS_QUERY)
    }

    const response = await fetchTeams

    return response.body.data
  } catch (e) {
    throw e
  }
}
