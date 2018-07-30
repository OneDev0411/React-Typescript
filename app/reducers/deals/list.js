import _ from 'underscore'
import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.NO_DEAL:
    case actionTypes.CLEAR_DEALS:
      return {}

    case actionTypes.GET_DEALS_FAILED:
      return null

    case actionTypes.ARCHIVE_DEAL:
      return _.omit(state, deal => deal.id === action.deal_id)

    case actionTypes.EJECT_DRAFT_MODE:
      return {
        ...state,
        [action.dealId]: {
          ...state[action.dealId],
          is_draft: false
        }
      }

    case actionTypes.GET_DEALS:
      return action.deals

    case actionTypes.CREATE_DEAL:
      return {
        [action.deal.id]: action.deal,
        ...state
      }

    case actionTypes.UPDATE_DEAL:
      return {
        ...state,
        [action.deal.id]: {
          ...state[action.deal.id],
          ...action.deal
        }
      }

    case actionTypes.APPEND_CHECKLIST:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          checklists: _.uniq([
            ...(state[action.deal_id].checklists || []),
            action.checklist_id
          ])
        }
      }

    case actionTypes.DELETE_ROLE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          roles: _.without(state[action.deal_id].roles, action.role_id)
        }
      }

    case actionTypes.CREATE_ROLES:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          roles: _.uniq([
            ...(state[action.deal_id].roles || []),
            ..._.pluck(action.roles, 'id')
          ])
        }
      }

    case actionTypes.ADD_STASH_FILE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          files: [...(state[action.deal_id].files || []), action.file]
        }
      }

    case actionTypes.DELETE_STASH_FILE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          files: _.filter(
            state[action.deal_id].files,
            file => file.id !== action.file_id
          )
        }
      }

    case actionTypes.CREATE_ENVELOPE:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          envelopes: [
            ...(state[action.deal_id].envelopes || []),
            action.envelope.id
          ]
        }
      }

    case actionTypes.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          new_notifications: action.count
        }
      }

    default:
      return state
  }
}

export const selectDeals = state => (state == null ? [] : Object.values(state))
