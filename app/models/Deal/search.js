import Fetch from '../../services/fetch'

/**
 * Search through all deals
 */
export async function searchAllDeals(query) {
  try {
    const response = await new Fetch().post('/deals/filter').send({ query })

    return response.body.data
  } catch (error) {
    return { error }
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
  let endpoint
  let params

  if (!user.brand) {
    throw new Error('This user does not belong to any brand')
  }

  // backoffice and agent has different endpoints and associations
  if (backoffice) {
    endpoint = `/brands/${user.brand}/deals/inbox`
    params = 'associations[]=deal.brand&'
    params += 'associations[]=deal.created_by&'
    params += 'associations[]=review.updated_by&'
    params += 'associations[]=deal.new_notifications'
  } else {
    endpoint = `/brands/${user.brand}/deals`
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
