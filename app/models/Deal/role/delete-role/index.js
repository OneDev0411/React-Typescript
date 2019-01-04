import Fetch from '../../../../services/fetch'

/**
 * delete role
 */
export async function deleteRole(deal_id, role_id) {
  try {
    await new Fetch().delete(`/deals/${deal_id}/roles/${role_id}`)

    return true
  } catch (e) {
    throw e
  }
}
