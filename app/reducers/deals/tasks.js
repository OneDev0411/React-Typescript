import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS_FAILED:
      return {}

    case types.DELETE_DEAL:
      return _.omit(state, task => task.deal === action.deal_id)

    case types.GET_TASKS:
      return {
        ...state,
        ...action.tasks
      }

    case types.IS_UPLOADING:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          ...{ uploading: action.status }
        }
      }

    case types.CREATE_TASK:
      return {
        [action.task.id]: action.task,
        ...state
      }

    case types.UPDATE_SUBMISSION:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          ...{ submission: action.submission }
        }
      }

    case types.CHANGE_TASK_STATUS:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          ...{
            review: {
              ...state[action.taskId].review,
              ...{ status: action.status }
            }
          }
        }
      }

    case types.CHANGE_NEEDS_ATTENTION:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          ...{ needs_attention: action.status }
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
              ...state[action.task_id].room.attachments || [],
              action.file
            ]
          }
        }
      }

    default:
      return state
  }
}
