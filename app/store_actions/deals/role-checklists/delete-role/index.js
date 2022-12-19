import * as actionTypes from '../../../../constants/deals'
import Deals from '../../../../models/Deal'

export function deleteChecklistsRole(brand_id, checklist_id, role_id) {
  return async dispatch => {
    try {
      await Deals.deleteChecklistsRole(brand_id, checklist_id, role_id)

      dispatch({
        type: actionTypes.DELETE_ROLE,
        brand_id,
        checklist_id,
        role_id
      })
    } catch (e) {
      throw e
    }
  }
}
