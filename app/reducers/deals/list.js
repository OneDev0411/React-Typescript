import { combineReducers } from 'redux'
import types from '../../constants/deals'
import error from './error'

export default (state = null, action) => {
  switch (action.type) {

    case types.NO_DEAL:
      return {}

    case types.GET_DEALS:
      return action.deals

    case types.CREATE_DEAL:
      return {
        [action.deal.id]: action.deal,
        ...state
      }

    case types.UPDATE_ROLES:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          ...{ roles: action.roles }
        }
      }

    default:
      return state
  }
}
