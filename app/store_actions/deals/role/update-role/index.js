import * as actionTypes from '../../../../constants/deals'
import Deals from '../../../../models/Deal'

export function updateRole(deal_id, role) {
  return async dispatch => {
    try {
      const updatedRole = await Deals.updateRole(deal_id, role)

      dispatch({
        type: actionTypes.UPDATE_ROLE,
        deal_id,
        role: updatedRole
      })
    } catch (e) {
      throw e
    }
  }
}
