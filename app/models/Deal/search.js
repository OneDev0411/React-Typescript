import Fetch from '../../services/fetch'
import {
  getActiveTeamId,
  getActiveTeamACL,
  viewAs
} from '../../utils/user-teams'

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
      .query({ 'associations[]': ['deal.brand'] })
      .query({ 'associations[]': ['user.agent'] })
      .query({ 'associations[]': ['agent.office'] })

    return response.body.data
  } catch (e) {
    throw e
  }
}

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

export default {
  getAll,
  getById,
  searchDeals
}
