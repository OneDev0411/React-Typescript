import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_CHECKLISTS:
      return {
        ...state,
        ...action.checklists
      }

    case types.CREATE_TASK:
      return {
        ...state,
        [action.list_id]: {
          ...state[action.list_id],
          tasks: [
            action.task.id,
            ...state[action.list_id].tasks || []
          ]
        }
      }

    default:
      return state
  }
}
