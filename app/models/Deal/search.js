import Fetch from '../../services/fetch'
import { getActiveTeamId, getActiveTeamACL } from '../../utils/user-teams'

/**
 * Search through all deals
 */
export async function searchAllDeals(query, isBackOffice) {
  try {
    let url = '/deals/filter'

    if (isBackOffice) {
      url += '?associations=deal.created_by'
    }

    const response = await new Fetch().post(url).send({ query })

    return response.body.data
  } catch (error) {
    throw error
  }
}

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
 * get deals list
 */
export async function getAll(user = {}, backoffice = false) {
  const { access_token } = user
  const brandId = getActiveTeamId(user)
  const acl = getActiveTeamACL(user)

  let endpoint
  let params

  if (!brandId) {
    throw new Error('This user does not belong to any brand')
  }

  if (
    (backoffice && acl.indexOf('BackOffice') === -1) ||
    (!backoffice && acl.indexOf('Deals') === -1)
  ) {
    throw new Error('Access denied to brand resource')
  }

  // backoffice and agent has different endpoints and associations
  if (backoffice) {
    endpoint = `/brands/${brandId}/deals/inbox`
    params = 'associations[]=deal.brand&'
    params += 'associations[]=deal.created_by&'
    params += 'associations[]=review.updated_by&'
    params += 'associations[]=deal.new_notifications'
  } else {
    endpoint = `/brands/${brandId}/deals`
    params = 'deleted=true&'
    params += 'associations[]=agent.office&'
    params += 'associations[]=deal.new_notifications'
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

export default {
  getAll,
  getById,
  searchAllDeals
}
