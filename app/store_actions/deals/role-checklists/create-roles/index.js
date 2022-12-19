import * as actionTypes from '../../../../constants/deals'
import Deals from '../../../../models/Deal'

export function createChecklistsRoles(brand_id, checklist_id, roles) {
  return async dispatch => {
    try {
      const createdChecklistRoles = await Deals.createChecklistsRole(
        brand_id,
        checklist_id,
        roles
      )

      dispatch({
        type: actionTypes.CREATE_ROLES,
        brand_id,
        checklist_id,
        roles: createdChecklistRoles
      })

      return createdChecklistRoles
    } catch (e) {
      throw e
    }
  }
}
