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

function _addRoles(user, role) {
  return {
    type: types.ADD_ROLE,
    user,
    role
  }
}

export function addRoles(user, role) {
  return async (dispatch) => {
    const response = await BrandConsole.addRoles(user, role)
    if (response) {
      const { data } = response.body
      dispatch(_addRoles(user, data))
    }
  }
}
