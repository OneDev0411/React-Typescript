import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_CONTEXTS:
      return action.contexts

    default:
      return state
  }
}
