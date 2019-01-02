import Fetch from '../../../../services/fetch'

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
