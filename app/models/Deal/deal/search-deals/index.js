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
    let associations = ''

    const payload = {
      brand: getActiveTeamId(user)
    }

    if (query && typeof query === 'string') {
      payload.query = query.trim()
    }

    if (isBackOffice) {
      associations = 'associations[]=deal.brand&'
      associations += 'associations[]=deal.created_by'
    } else {
      associations = 'associations[]=deal.brand'

      const users = viewAs(user)

      if (users.length > 0) {
        payload.role = {
          user: users
        }
      }

      payload.$order = order
    }

    const response = await new Fetch()
      .post(`${url}?${associations}`)
      .send(payload)

    return response.body.data
  } catch (e) {
    throw e
  }
}