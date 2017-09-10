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

    case types.APPEND_CHECKLIST:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          checklists: [
            ...state[action.deal_id].checklists || [],
            action.checklist_id
          ]
        }
      }

    case types.SET_DEAL_CONTEXTS:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          ...action.contexts
        }
      }

    case types.UPDATE_ROLES:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          ...{ roles: action.roles }
        }
      }

    case types.SET_ENVELOPES:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          ...{
            envelopes: [
              ...state[action.deal_id].envelopes || [],
              ...action.envelopes
            ]
          }
        }
      }

    default:
      return state
  }
}
