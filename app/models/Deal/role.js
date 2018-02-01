import Fetch from '../../services/fetch'

/**
 * add new role
 */
export async function createRole(deal_id, roles) {
  try {
    const response = await new Fetch()
      .post(`/deals/${deal_id}/roles`)
      .send({ roles })

    return response.body.data
  } catch (e) {
    throw e
  }
}

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

export default {
  createRole,
  updateRole,
  deleteRole
}
