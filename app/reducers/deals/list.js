import { combineReducers } from 'redux'
import _ from 'underscore'
import types from '../../constants/deals'
import error from './error'

export default (state = null, action) => {
  switch (action.type) {
    case types.NO_DEAL:
      return {}

    case types.GET_DEALS_FAILED:
      return null

    case types.ARCHIVE_DEAL:
      return _.omit(state, deal => deal.id === action.deal_id)

    case types.GET_DEALS:
      return action.deals

    case types.ADD_SEARCHED_DEALS:
      const notSearchedDeals = _.pick(state, deal => !deal.searchResult)

      return { ...notSearchedDeals, ...action.deals }

    case types.CREATE_DEAL:
      return {
        [action.deal.id]: action.deal,
        ...state
      }

    case types.UPDATE_DEAL:
      return {
        ...state,
        [action.deal.id]: {
          ...state[action.deal.id],
          ...action.deal
        }
      }

    case types.APPEND_CHECKLIST:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          checklists: _.uniq([
            ...state[action.deal_id].checklists || [],
            action.checklist_id
          ])
        }
      }

    case types.UPDATE_ROLES:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          roles: [
            ...state[action.deal_id].roles,
            ...action.roles
          ]
        }
      }

    case types.UPDATE_ROLE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          roles: [
            ..._.omit(state[action.deal_id].roles, role => role.id === action.role.id),
            action.role
          ]
        }
      }

    case types.DELETE_ROLE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          roles: state[action.deal_id].roles.filter(role => role.id !== action.role_id)
        }
      }

    case types.SET_ENVELOPES:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          envelopes: {
            ...action.envelopes,
            ...state[action.deal_id].envelopes
          }
        }
      }

    case types.SET_ENVELOPE_STATUS:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          envelopes: {
            ...state[action.deal_id].envelopes,
            [action.envelope_id]: {
              ...state[action.deal_id].envelopes[action.envelope_id],
              status: action.status
            }
          }
        }
      }

    default:
      return state
  }
}
