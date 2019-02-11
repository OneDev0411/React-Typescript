import Fetch from '../../../../services/fetch'

import { getActiveTeamId, getActiveTeamACL } from '../../../../utils/user-teams'

/**
 * get deals list
 */
export async function getAll(user) {
  const { access_token } = user
  const brandId = getActiveTeamId(user)
  const acl = getActiveTeamACL(user)
  const isBackOffice = acl.includes('BackOffice')
  const isAgent = acl.includes('Deals')

  const hasAccess = isAgent || isBackOffice

  let endpoint
  let params

  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  if (!hasAccess) {
    throw new Error('Access denied to brand resource')
  }

  // backoffice and agent has different endpoints and associations
  if (isBackOffice) {
    endpoint = `/brands/${brandId}/deals/inbox`
    params = 'associations[]=deal.brand&'
    params += 'associations[]=deal.created_by&'
    params += 'associations[]=review.updated_by&'
    params += 'associations[]=deal.new_notifications'
  } else {
    endpoint = `/brands/${brandId}/deals`
    params = 'deleted=true&'
    params += 'associations[]=agent.office&'
    params += 'associations[]=deal.new_notifications&'
    params += 'associations[]=deal.brand'
  }

  try {
    const fetchDeals = new Fetch().get(`${endpoint}?${params}`)

    // required on ssr
    if (access_token) {
      fetchDeals.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await fetchDeals

    return response.body.data
  } catch (e) {
    throw e
  }
}
