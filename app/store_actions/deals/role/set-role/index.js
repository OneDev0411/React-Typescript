import * as actionTypes from '../../../../constants/deals'

export function setRoles(roles) {
  return {
    type: actionTypes.GET_ROLES,
    roles
  }
}
