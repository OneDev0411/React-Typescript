import _ from 'underscore'

import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_DEALS_FAILED:
    case actionTypes.CLEAR_DEALS:
      return {}

    case actionTypes.DELETE_TASK:
      return {
        ...state,
        [action.checklistId]: {
          ...state[action.checklistId],
          tasks: _.without(state[action.checklistId].tasks, action.taskId)
        }
      }

    case actionTypes.GET_CHECKLISTS:
      return {
        ...state,
        ...action.checklists
      }

    case actionTypes.UPDATE_CHECKLIST:
      return {
        ...state,
        [action.id]: action.checklist
      }

    case actionTypes.CREATE_TASK:
      return {
        ...state,
        [action.list_id]: {
          ...state[action.list_id],
          tasks: _.uniq([
            action.task.id,
            ...(state[action.list_id].tasks || [])
          ])
        }
      }

    case actionTypes.SET_EXPAND_CHECKLIST:
      return {
        ...state,
        [action.checklistId]: {
          ...state[action.checklistId],
          is_expanded: action.isExpanded
        }
      }

    default:
      return state
  }
}

export const getDealChecklists = (deal, state) =>
  deal && Array.isArray(deal.checklists)
    ? deal.checklists.map(id => state[id])
    : []

export const getChecklistById = (state, id) => state && state[id]

export const isChecklistExpanded = (state, id) =>
  state[id].is_expanded !== undefined ? state[id].is_expanded : true
