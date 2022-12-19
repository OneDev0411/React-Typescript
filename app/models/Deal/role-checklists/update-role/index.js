import Fetch from '../../../../services/fetch'

/**
 * update a role
 */
export async function updateRole(brand_id, checklist_id, role) {
  try {
    const response = await new Fetch()
      .put(`/brands/${brand_id}/checklists/${checklist_id}/roles/${role.id}`)
      .query({ 'associations[]': ['agent.office'] })
      .send(role)

    return response.body.data
  } catch (e) {
    throw e
  }
}
