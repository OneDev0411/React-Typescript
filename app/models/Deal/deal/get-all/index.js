import { ACL } from '@app/constants/acl'
import { getTeamACL } from 'utils/acl'

import Fetch from '../../../../services/fetch'

/**
 * get deals list
 */
export async function getAll(team) {
  const brandId = team?.brand?.id
  const acl = getTeamACL(team)
  const isBackOffice = acl.includes(ACL.BACK_OFFICE)
  const isAgent = acl.includes(ACL.DEALS)

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
    params += 'associations[]=deal.new_notifications&'
    params += 'associations[]=deal.property_type'
  } else {
    endpoint = `/brands/${brandId}/deals`
    params = 'deleted=true&'
    params += 'associations[]=agent.office&'
    params += 'associations[]=deal.new_notifications&'
    params += 'associations[]=deal.brand&'
    params += 'associations[]=deal.property_type'
  }

  try {
    const fetchDeals = new Fetch().get(`${endpoint}?${params}`)

    const response = await fetchDeals

    return response.body.data
  } catch (e) {
    throw e
  }
}
