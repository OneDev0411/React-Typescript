import _ from 'underscore'

import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_DEALS_FAILED:
    case actionTypes.CLEAR_DEALS:
      return {}

    case actionTypes.DELETE_TASK:
      return _.omit(state, task => task.id === action.taskId)

    case actionTypes.GET_TASKS:
      return {
        ...state,
        ...action.tasks
      }

    case actionTypes.CREATE_TASK:
      return {
        [action.task.id]: action.task,
        ...state
      }

    case actionTypes.UPDATE_TASK:
      return {
        ...state,
        [action.task.id]: action.task
      }

    case actionTypes.UPDATE_TASKS:
      return {
        ...state,
        ...action.tasks
      }

    case actionTypes.SET_EXPAND_TASK:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          is_expanded: action.isExpanded
        }
      }

    case actionTypes.UPDATE_SUBMISSION:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          submission: action.submission
        }
      }

    case actionTypes.CHANGE_TASK_STATUS:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          review: {
            ...state[action.taskId].review,
            status: action.status
          }
        }
      }

    case actionTypes.CHANGE_ATTENTION_REQUESTED:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          attention_requested: action.status
        }
      }

    case actionTypes.CHANGE_TASK_REQUIREMENT:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          required: action.required
        }
      }

    case actionTypes.ADD_TASK_FILE:
      return {
        ...state,
        [action.task_id]: {
          ...state[action.task_id],
          room: {
            ...state[action.task_id].room,
            attachments: [
              ...(state[action.task_id].room.attachments || []),
              action.file
            ]
          }
        }
      }

    case actionTypes.DELETE_TASK_FILE:
      return {
        ...state,
        [action.task_id]: {
          ...state[action.task_id],
          room: {
            ...state[action.task_id].room,
            attachments: (state[action.task_id].room.attachments || []).filter(
              file => file.id !== action.file_id
            )
          }
        }
      }

    case actionTypes.RENAME_TASK_FILE:
      return {
        ...state,
        [action.task_id]: {
          ...state[action.task_id],
          room: {
            ...state[action.task_id].room,
            attachments: (state[action.task_id].room.attachments || []).map(
              file =>
                file.id !== action.file_id
                  ? file
                  : {
                      ...file,
                      name: action.filename
                    }
            )
          }
        }
      }

    default:
      return state
  }
}

export const selectTaskById = (state, id) => (state && id ? state[id] : null)

export const selectChecklistTasks = (checklist, state) =>
  Array.isArray(checklist.tasks) ? checklist.tasks.map(id => state[id]) : []

export const selectDealTasks = (
  deal,
  checklists,
  state,
  includeTerminatedChecklists = false
) => {
  const list = []

  if (!deal.checklists) {
    return list
  }

  deal.checklists.forEach(checklistId => {
    const checklist = checklists[checklistId]

    if (checklist.is_terminated && !includeTerminatedChecklists) {
      return
    }

    if (checklist.tasks) {
      checklist.tasks.forEach(taskId => list.push(state[taskId]))
    }
  })

  return list
}
