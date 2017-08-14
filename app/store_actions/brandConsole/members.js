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

function _addMembers(role_id, members) {
  return {
    type: types.ADD_MEMBER,
    members,
    role_id
  }
}

export function addMembers(role, members) {
  return async (dispatch) => {
    const response = await BrandConsole.addMembers(role, members)
    if (response) {
      const { data } = response.body
      dispatch(_addMembers(role.id, data))
    }
  }
}

function _deleteMembers(role_id, member_id) {
  return {
    type: types.DELETE_MEMBER,
    member_id,
    role_id
  }
}

export function deleteMembers(role, member_id) {
  return async (dispatch) => {
    const response = await BrandConsole.deleteMember(role, member_id)
    if (response &&
      response.body.status === 'success') {
      dispatch(_deleteMembers(role.id, member_id))
    }
  }
}
