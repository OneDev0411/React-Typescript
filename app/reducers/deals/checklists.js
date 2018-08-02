import * as actionTypes from '../../constants/deals'
import _ from 'underscore'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_DEALS_FAILED:
    case actionTypes.CLEAR_DEALS:
      return {}

    case actionTypes.ARCHIVE_DEAL:
      return _.omit(state, checklist => checklist.deal === action.deal_id)

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

    default:
      return state
  }
}
