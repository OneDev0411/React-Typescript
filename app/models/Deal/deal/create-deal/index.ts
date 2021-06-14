import Fetch from '../../../../services/fetch'

import { getActiveTeamId } from '../../../../utils/user-teams'

/**
 * create new deal
 */
export async function create(user: IUser, data: object) {
  try {
    const response = await new Fetch()
      .post('/deals')
      .query({ 'associations[]': ['deal.checklists'] })
      .query({ 'associations[]': ['deal.brand'] })
      .query({ 'associations[]': ['deal.property_type'] })
      .set('X-RECHAT-BRAND', getActiveTeamId(user)!)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}
