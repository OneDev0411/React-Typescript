import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'
import { addNotification as notify } from 'reapop'

function _getMembers(role_id, members) {
  return {
    type: types.GET_MEMBERS,
    members,
    role_id
  }
}

export function getMembers(role) {
  return async dispatch => {
    const response = await BrandConsole.getMembers(role)

    if (response) {
      const { data } = response.body

      dispatch(_getMembers(role.id, data))
    }
  }
}

function _addMembers(brandId, roleId, members) {
  return {
    type: types.ADD_MEMBER,
    members,
    roleId,
    brandId
  }
}

export function addMembers(brandId, roleId, members) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.addMembers(brandId, roleId, members)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      const { data } = response.body

      dispatch(_addMembers(brandId, roleId, data))
    } else {
      dispatch(
        notify({
          message: `addMembers: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}

function _deleteMembers(role, member_id) {
  return {
    type: types.DELETE_MEMBER,
    member_id,
    role
  }
}

export function deleteMembers(role, member_id) {
  return async dispatch => {
    dispatch({ type: types.SHOW_SPINNER })

    const response = await BrandConsole.deleteMember(role, member_id)

    dispatch({ type: types.HIDE_SPINNER })

    if (response && !response.error) {
      dispatch(_deleteMembers(role, member_id))
    } else {
      dispatch(
        notify({
          message: `deleteMembers: ${response.error.message}`,
          status: 'error'
        })
      )
    }
  }
}
