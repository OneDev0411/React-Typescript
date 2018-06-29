import Fetch from '../../services/fetch'
import { getActiveTeamId, getActiveTeamACL } from '../../utils/user-teams'

/**
 * get deal by id
 */
export async function getById(id) {
  try {
    const response = await new Fetch()
      .get(`/deals/${id}`)
      .query({ 'associations[]': ['room.attachments'] })
      .query({ 'associations[]': ['deal.checklists'] })
      .query({ 'associations[]': ['deal.envelopes'] })
      .query({ 'associations[]': ['deal.files'] })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * search deals
 */
export async function searchDeals(user, value) {
  try {
    const isBackOffice = getActiveTeamACL(user).includes('BackOffice')

    let url = '/deals/filter'

    if (isBackOffice) {
      url += '?associations[]=deal.created_by&associations[]=deal.brand'
    }

    const response = await new Fetch().post(url).send({
      query: value,
      brand: getActiveTeamId(user)
    })

    return response.body.data
  } catch (e) {
    throw e
  }
}

/**
 * get deals list
 */
export async function getAll(user) {
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
    const response = await new Fetch().get(`${endpoint}?${params}`)

    return response.body.data
  } catch (e) {
    throw e
  }
}

export default {
  getAll,
  getById,
  searchDeals
}
