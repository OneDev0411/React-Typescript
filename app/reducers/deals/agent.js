import * as actionTypes from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case actionTypes.GET_AGENTS:
      return action.agents

    default:
      return state
  }
}
