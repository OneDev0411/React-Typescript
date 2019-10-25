import _ from 'underscore'

import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_DEALS_FAILED:
    case actionTypes.CLEAR_DEALS:
      return {}

    case actionTypes.GET_ROLES:
      return {
        ...state,
        ...action.roles
      }

    case actionTypes.DELETE_ROLE:
      return _.omit(state, role => role.id === action.role_id)

    case actionTypes.CREATE_ROLES:
      return {
        ...state,
        ..._.indexBy(action.roles, 'id')
      }

    case actionTypes.UPDATE_ROLE:
      return {
        ...state,
        [action.role.id]: action.role
      }

    default:
      return state
  }
}

/**
 *
 * @param {unknown} state
 * @param {IDeal | undefined} deal
 * @return {*}
 */
export const selectDealRoles = (state, deal) =>
  deal && Array.isArray(deal.roles) ? deal.roles.map(id => state[id]) : []
