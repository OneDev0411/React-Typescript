import Fetch from '../../../../services/fetch'

import {
  getActiveTeamId,
  getActiveTeamACL,
  viewAs
} from '../../../../utils/user-teams'

/**
 * search deals
 */
export async function searchDeals(
  user,
  query,
  order = ['deals.updated_at', 'DESC']
) {
  try {
    const isBackOffice = getActiveTeamACL(user).includes('BackOffice')

    let url = '/deals/filter'

    const payload = {
      brand: getActiveTeamId(user)
    }

    if (query && typeof query === 'string') {
      payload.query = query.trim()
    }

    if (isBackOffice) {
      url += '?associations[]=deal.created_by&associations[]=deal.brand'
    } else {
      const users = viewAs(user)

      if (users.length > 0) {
        payload.role = {
          user: users
        }
      }

      payload.$order = order
    }

    const response = await new Fetch().post(url).send(payload)

    return response.body.data
  } catch (e) {
    throw e
  }
}
