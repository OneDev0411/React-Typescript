import * as actionTypes from '../../../../constants/deals'
import Deals from '../../../../models/Deal'

export function deleteRole(deal_id, role_id) {
  return async dispatch => {
    try {
      await Deals.deleteRole(deal_id, role_id)

      dispatch({
        type: actionTypes.DELETE_ROLE,
        deal_id,
        role_id
      })
    } catch (e) {
      throw e
    }
  }
}
