import Fetch from '../../../../services/fetch'

/**
 * delete role
 */
export async function deleteChecklistsRole(brand_id, checklist_id, role_id) {
  try {
    await new Fetch().delete(
      `/brands/${brand_id}/checklists/${checklist_id}/roles/${role_id}`
    )

    return true
  } catch (e) {
    throw e
  }
}
