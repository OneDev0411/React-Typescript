import types from '../../constants/deals'
import Deals from '../../models/Deal'

function rolesCreated(deal_id, roles) {
  return {
    type: types.CREATE_ROLES,
    deal_id,
    roles
  }
}

function roleUpdated(deal_id, role) {
  return {
    type: types.UPDATE_ROLE,
    deal_id,
    role
  }
}

function roleDeleted(deal_id, role_id) {
  return {
    type: types.DELETE_ROLE,
    deal_id,
    role_id
  }
}

export function setRoles(roles) {
  return {
    type: types.GET_ROLES,
    roles
  }
}

export function selectRole(role) {
  return {
    type: types.SET_SELECTED_ROLE,
    role
  }
}

export function createRoles(deal_id, roles) {
  return async (dispatch) => {
    try {
      const createdRoles = await Deals.createRole(deal_id, roles)
      dispatch(rolesCreated(deal_id, createdRoles))
    } catch (e) {
      throw e
    }
  }
}

export function updateRole(deal_id, role) {
  return async (dispatch) => {
    try {
      const updatedRole = await Deals.updateRole(deal_id, role)
      dispatch(roleUpdated(deal_id, updatedRole))
    } catch (e) {
      throw e
    }
  }
}

export function deleteRole(deal_id, role_id) {
  return async (dispatch) => {
    try {
      await Deals.deleteRole(deal_id, role_id)
      dispatch(roleDeleted(deal_id, role_id))
    } catch (e) {
      throw e
    }
  }
}
