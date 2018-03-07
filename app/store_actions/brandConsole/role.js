import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'
import { addNotification as notify } from 'reapop'

function _getRoles(roles) {
  return {
    type: types.GET_ROLES,
    roles
  }
}

export function getRoles(brand) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.getRoles(brand)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_getRoles(data))
    } else {
      dispatch(
        notify({
          message: `getRoles: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _addRole(role) {
  return {
    type: types.ADD_ROLE,
    role
  }
}

export function addRole(brand, role) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.addRole(brand, role)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_addRole(data))
    } else {
      dispatch(
        notify({
          message: `addRole: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _deleteRole(role_id) {
  return {
    type: types.DELETE_ROLE,
    role_id
  }
}

export function deleteRole(role) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.deleteRole(role)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      dispatch(_deleteRole(role.id))
    } else {
      dispatch(
        notify({
          message: `deleteRoles: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _editRole(role) {
  return {
    type: types.EDIT_ROLE,
    role
  }
}

export function editRole(role) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.editRole(role)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_editRole(data))
    } else {
      dispatch(
        notify({
          message: `editRole: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}
