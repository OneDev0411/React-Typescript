import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_TASKS:
      return action.tasks

    case types.CREATE_TASK:
      return {
        ...state,
        [action.task.id]: action.task
      }

    case types.UPDATE_SUBMISSION:
      return {
        ...state,
        [action.taskId]: {
          ...state[action.taskId],
          ...{ submission: action.submission }
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
