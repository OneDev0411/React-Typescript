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

    default:
      return state
  }
}
