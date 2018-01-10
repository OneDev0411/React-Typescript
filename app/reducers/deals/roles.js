import _ from 'underscore'
import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS_FAILED:
      return {}

    case types.ARCHIVE_DEAL:
      return _.omit(state, role => role.deal === action.deal_id)

    case types.GET_ROLES:
      return {
        ...state,
        ...action.roles
      }

    case types.DELETE_ROLE:
      return _.omit(state, role => role.id === action.role_id)

    case types.CREATE_ROLES:
      return {
        ...state,
        ..._.indexBy(action.roles, 'id')
      }

    case types.UPDATE_ROLE:
      return {
        ...state,
        [action.role.id]: action.role
      }

    default:
      return state
  }
}
