import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS:
      return action.deals

    default:
      return state
  }
}
