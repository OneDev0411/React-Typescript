import Fetch from '../../../../services/fetch'

/**
 * add new role
 */
export async function createChecklistsRole(brand_id, checklist_id, roles) {
  try {
    const response = await new Fetch()
      .post(`/brands/${brand_id}/checklists/${checklist_id}/roles`)
      .query({ 'associations[]': ['agent.office'] })
      .send({ roles })

    return response.body.data
  } catch (e) {
    throw e
  }
}
