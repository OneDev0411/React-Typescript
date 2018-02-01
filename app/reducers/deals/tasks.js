import _ from 'underscore'
import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS_FAILED:
      return {}

    case types.ARCHIVE_DEAL:
      return _.omit(state, task => task.deal === action.deal_id)

    case types.DELETE_TASK:
      return _.omit(state, task => task.id === action.taskId)

    case types.GET_TASKS:
      return {
        ...state,
        ...action.tasks
      }

    case types.CREATE_TASK:
      return {
        [action.task.id]: action.task,
        ...state
      }

    case types.UPDATE_TASK:
      return {
        ...state,
        [action.task.id]: action.task
      }

    case types.UPDATE_TASKS:
      return {
        ...state,
        ...action.tasks
      }

    case types.UPDATE_SUBMISSION:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          submission: action.submission
        }
      }

    case types.CHANGE_TASK_STATUS:
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

    case types.CHANGE_NEEDS_ATTENTION:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          needs_attention: action.status
        }
      }

    case types.ADD_ATTACHMENT:
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

    case types.DELETE_ATTACHMENT:
      return {
        ...state,
        [action.task_id]: {
          ...state[action.task_id],
          room: {
            ...state[action.task_id].room,
            attachments: state[action.task_id].room.attachments.filter(file => file.id !== action.file_id)
          }
        }
      }

    default:
      return state
  }
}
