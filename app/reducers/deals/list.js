import _ from 'underscore'
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
      let checklists = state[action.deal_id].checklists
      let index = _.findIndex(checklists, list => list.id === action.list_id)

      checklists[index].tasks = [
        ...checklists[index].tasks || [],
        action.task
      ]

      return {
        ...state,
        [action.deal_id]: {
          ...state[action.deal_id],
          ...checklists
        }
      }
    }

    default:
      return state
  }
}
