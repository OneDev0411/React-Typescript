import Fetch from '../../../../services/fetch'

import { getActiveTeamId, getActiveTeamACL } from '../../../../utils/user-teams'

/**
 * search deals
 */
export async function searchDeals(
  user,
  criteria,
  order = ['deals.updated_at', 'DESC']
) {
  try {
    const isBackOffice = getActiveTeamACL(user).includes('BackOffice')

    let url = '/deals/filter'
    let associations = ''

    let payload = {
      brand: getActiveTeamId(user)
    }

    if (criteria && typeof criteria === 'object') {
      payload = {
        ...payload,
        ...criteria
      }
    }

    if (typeof criteria === 'string') {
      payload = {
        ...payload,
        query: criteria.trim()
      }
    }

    if (isBackOffice) {
      associations = 'associations[]=deal.brand&'
      associations += 'associations[]=deal.created_by'
    } else {
      associations = 'associations[]=deal.brand'

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
