import { ACL } from 'constants/acl'
import { getTeamACL } from 'utils/acl'

import Fetch from '../../../../services/fetch'

/**
 * search deals
 */
export async function searchDeals(
  team,
  criteria,
  order = ['deals.updated_at', 'DESC']
) {
  try {
    const brandId = team?.brand?.id ?? null

    if (!brandId) {
      throw new Error('there is not active brand')
    }

    const isBackOffice = getTeamACL(team).includes(ACL.BACK_OFFICE)

    let url = '/deals/filter'
    let associations = ''

    let payload = {
      brand: brandId
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
      associations += 'associations[]=deal.property_type&'
      associations += 'associations[]=deal.created_by'
    } else {
      associations = 'associations[]=deal.brand&'
      associations += 'associations[]=deal.property_type'

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
