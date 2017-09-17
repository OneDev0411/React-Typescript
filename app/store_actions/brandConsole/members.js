import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _getMembers(role_id, members) {
  return {
    type: types.GET_MEMBERS,
    members,
    role_id
  }
}

export function getMembers(role) {
  return async (dispatch) => {
    const response = await BrandConsole.getMembers(role)
    if (response) {
      const { data } = response.body
      dispatch(_getMembers(role.id, data))
    }
  }
}

function _addMembers(role, members) {
  return {
    type: types.ADD_MEMBER,
    members,
    role
  }
}

export function addMembers(role, members) {
  return async (dispatch) => {
    dispatch({ type: types.SHOW_SPINNER })
    const response = await BrandConsole.addMembers(role, members)
    dispatch({ type: types.HIDE_SPINNER })
    if (response && !response.error) {
      const { data } = response.body
      dispatch(_addMembers(role, data))
    } else {
      dispatch(notify({ message: `addBrand: ${response.error.message}`, status: response.error.statusCode }))
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
  return async (dispatch) => {
    dispatch({ type: types.SHOW_SPINNER })
    const response = await BrandConsole.deleteMember(role, member_id)
    dispatch({ type: types.HIDE_SPINNER })
    if (response && !response.error && response.body.status === 'success') {
      dispatch(_deleteMembers(role, member_id))
    } else {
      dispatch(notify({ message: `deleteBrand: ${response.error.message}`, status: response.error.statusCode }))
    }
  }
}
