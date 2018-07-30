import _ from 'underscore'
import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_DEALS_FAILED:
    case actionTypes.CLEAR_DEALS:
      return {}

    case actionTypes.ARCHIVE_DEAL:
      return _.omit(state, task => task.deal === action.deal_id)

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
            attachments: state[action.task_id].room.attachments.filter(
              file => file.id !== action.file_id
            )
          }
        }
      }

    default:
      return state
  }
}
