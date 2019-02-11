import Fetch from '../../../../services/fetch'

/**
 * update deal context
 */
export async function upsertContexts(deal_id, contexts) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/context`)
      .send({ context: contexts })

    return response.body.data
  } catch (e) {
    return false
  }
}
