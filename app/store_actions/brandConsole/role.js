import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _getRoles(roles) {
  return {
    type: types.GET_ROLES,
    roles
  }
}

export function getRoles(user) {
  return async (dispatch) => {
    const response = await BrandConsole.getRoles(user)
    if (response) {
      const { data } = response.body
      dispatch(_getRoles(data))
    }
  }
}

function _addRoles(role) {
  return {
    type: types.ADD_ROLE,
    role
  }
}

export function addRoles(user, role) {
  return async (dispatch) => {
    const response = await BrandConsole.addRoles(user, role)
    if (response) {
      const { data } = response.body
      dispatch(_addRoles(data))
    }
  }
}

function _deleteRoles(role_id) {
  return {
    type: types.DELETE_ROLE,
    role_id
  }
}

export function deleteRoles(role) {
  return async (dispatch) => {
    const response = await BrandConsole.deleteRole(role)
    if (response &&
      response.body.status === 'success') {
      dispatch(_deleteRoles(role.id))
    }
  }
}
