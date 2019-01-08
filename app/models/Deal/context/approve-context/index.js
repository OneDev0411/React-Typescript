import Fetch from '../../../../services/fetch'

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
