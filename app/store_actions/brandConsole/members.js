import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _getMembers(role, members) {
  return {
    type: types.GET_MEMBERS,
    members,
    role
  }
}

export function getMembers(role) {
  return async (dispatch) => {
    const response = await BrandConsole.getMembers(role)
    if (response) {
      const { data } = response.body
      dispatch(_getMembers(role, data))
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
    const response = await BrandConsole.getMembers(role, members)
    if (response) {
      const { data } = response.body
      dispatch(_addMembers(role_id, data))
    }
  }
}

