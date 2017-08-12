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
