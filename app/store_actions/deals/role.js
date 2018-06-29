import * as actionTypes from '../../constants/deals'
import Deals from '../../models/Deal'

export function setRoles(roles) {
  return {
    type: actionTypes.GET_ROLES,
    roles
  }
}

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
