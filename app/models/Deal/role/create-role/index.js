import Fetch from '../../../../services/fetch'

/**
 * add new role
 */
export async function createRole(deal_id, roles) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/roles`)
      .query({ 'associations[]': ['agent.office'] })
      .send({ roles })

    return response.body.data
  } catch (e) {
    throw e
  }
}
