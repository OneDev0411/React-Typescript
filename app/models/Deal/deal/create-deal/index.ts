import Fetch from '../../../../services/fetch'

import { getActiveTeamId } from '../../../../utils/user-teams'

/**
 * create new deal
 */
export async function create(user: IUser, data: object) {
  try {
    const response = await new Fetch()
      .post('/deals?associations[]=deal.checklists&associations[]=deal.brand')
      .set('X-RECHAT-BRAND', getActiveTeamId(user)!)
      .send(data)

    return response.body.data
  } catch (e) {
    throw e
  }
}
