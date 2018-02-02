import Fetch from '../../services/fetch'
import { getActiveTeamId } from '../../utils/user-teams'

/**
 * get all agents of brand
 */
export async function getAgents(user) {
  const brandId = getActiveTeamId(user)

  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  try {
    const response = await new Fetch().get(`/brands/${brandId}/agents`)

    return response.body.data
  } catch (e) {
    return null
  }
}

export default {
  getAgents
}
