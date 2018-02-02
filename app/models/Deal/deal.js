import Fetch from '../../services/fetch'
import { getActiveTeamId } from '../../utils/user-teams'

/**
 * archive a deal
 */
export async function archiveDeal(dealId) {
  try {
    await new Fetch().delete(`/deals/${dealId}`)
  } catch (e) {
    throw e
  }
}

/**
 * create new deal
 */
export async function create(user, data) {
  try {
    const response = await new Fetch()
      .post('/deals?associations[]=deal.checklists')
      .set('X-RECHAT-BRAND', getActiveTeamId(user))
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default {
  create,
  archiveDeal
}
