import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS:
      return action.deals

    case types.CREATE_DEAL:
      return {
        [action.deal.id]: action.deal,
        ...state
      }

    case types.CREATE_TASK: {
      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          tasks: [
            ...state[action.deal_id].tasks || [],
            action.task
          ]
        }
      }
    }

    default:
      return state
  }
}
