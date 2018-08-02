import * as actionTypes from '../../../../constants/deals'
import Deals from '../../../../models/Deal'

export function createRoles(deal_id, roles) {
  return async dispatch => {
    try {
      const createdRoles = await Deals.createRole(deal_id, roles)

      dispatch({
        type: actionTypes.CREATE_ROLES,
        deal_id,
        roles: createdRoles
      })
    } catch (e) {
      throw e
    }
  }
}
