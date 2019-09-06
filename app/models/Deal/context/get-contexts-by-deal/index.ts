import Fetch from '../../../../services/fetch'

/**
 * get contexts list based on deal id
 */
export async function getContextsByDealId(dealId: UUID): Promise<any> {
  try {
    const response = await new Fetch().get(`/deals/${dealId}/contexts`)

    return response.body.data
  } catch (e) {
    return null
  }
}
