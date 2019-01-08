import Fetch from '../../../../services/fetch'

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
