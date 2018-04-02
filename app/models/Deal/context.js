import Fetch from '../../services/fetch'

/**
 * get contexts info
 */
export async function getContexts(user = {}) {
  const { access_token } = user

  try {
    const request = new Fetch().get('/deals/contexts')

    // required on ssr
    if (access_token) {
      request.set({ Authorization: `Bearer ${access_token}` })
    }

    const response = await request

    return response.body.data
  } catch (e) {
    return null
  }
}

/**
 * update deal context
 */
export async function updateContext(dealId, context) {
  try {
    const response = await new Fetch().post(`/deals/${dealId}/context`).send({
      context
    })

    return response.body.data
  } catch (e) {
    return false
  }
}

/**
 * approve deal context
 */
export async function approveContext(dealId, contextId) {
  try {
    const response = await new Fetch()
      .patch(`/deals/${dealId}/context/${contextId}/approved`)
      .send({ approved: true })

    return response.body.data
  } catch (e) {
    return false
  }
}

/**
 * get deal context history
 */
export async function getContextHistory(dealId, name) {
  try {
    const response = await new Fetch()
      .get(`/deals/${dealId}/context/${name}`)
      .query({ 'associations[]': ['deal_context_item.approved_by'] })
      .query({ 'associations[]': ['deal_context_item.created_by'] })
      .query({ 'associations[]': ['deal_context_item.submission'] })

    return response.body.data
  } catch (e) {
    return false
  }
}

export default {
  getContexts,
  getContextHistory,
  updateContext,
  approveContext
}
