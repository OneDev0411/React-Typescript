import * as actionTypes from '../../../../constants/deals'
import Deals from '../../../../models/Deal'

export function updateChecklistsRole(brand_id, checklist_id, role) {
  return async dispatch => {
    try {
      const updatedRole = await Deals.updatehecklistsRole(
        brand_id,
        checklist_id,
        role
      )

      dispatch({
        type: actionTypes.UPDATE_ROLE,
        brand_id,
        checklist_id,
        role: updatedRole
      })

      return updatedRole
    } catch (e) {
      throw e
    }
  }
}
