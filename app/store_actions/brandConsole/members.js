import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _getMembers(role, members) {
  return {
    type: types.GET_MEMBERS,
    members,
    role
  }
}

export function getMembers(user, role) {
  return async (dispatch) => {
    const response = await BrandConsole.getMembers(user, role)
    if (response) {
      const { data } = response.body
      dispatch(_getMembers(role, data))
    }
  }
}

