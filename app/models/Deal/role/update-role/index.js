import Fetch from '../../../../services/fetch'

/**
 * update a role
 */
export async function updateRole(deal_id, role) {
  try {
    const response = await new Fetch()
      .put(`/deals/${deal_id}/roles/${role.id}`)
      .send(role)

    return response.body.data
  } catch (e) {
    throw e
  }
}
