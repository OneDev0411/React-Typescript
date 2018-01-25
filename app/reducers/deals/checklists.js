import types from '../../constants/deals'
import _ from 'underscore'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS_FAILED:
      return {}

    case types.ARCHIVE_DEAL:
      return _.omit(state, checklist => checklist.deal === action.deal_id)

    case types.DELETE_TASK:
      return {
        ...state,
        [action.checklistId]: {
          ...state[action.checklistId],
          tasks: _.without(state[action.checklistId].tasks, action.taskId)
        }
      }

    case types.GET_CHECKLISTS:
      return {
        ...state,
        ...action.checklists
      }

    case types.UPDATE_CHECKLIST:
      return {
        ...state,
        [action.id]: action.checklist
      }

    case types.CREATE_TASK:
      return {
        ...state,
        [action.list_id]: {
          ...state[action.list_id],
          tasks: _.uniq([action.task.id, ...(state[action.list_id].tasks || [])])
        }
      }

    default:
      return state
  }
}
