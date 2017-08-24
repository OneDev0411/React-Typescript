import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_DEALS_FAILED:
      return {
        action: action.name,
        message: action.message
      }

    default:
      return state
  }
}
