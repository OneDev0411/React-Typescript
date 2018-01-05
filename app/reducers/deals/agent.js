import types from '../../constants/deals'

export default (state = false, action) => {
  switch (action.type) {
    case types.GET_AGENTS:
      return action.agents

    default:
      return state
  }
}
