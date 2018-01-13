import types from '../../constants/deals'

export default (state = false, action) => {
  switch (action.type) {
    case types.GET_CONTEXTS:
      return action.contexts

    default:
      return state
  }
}
