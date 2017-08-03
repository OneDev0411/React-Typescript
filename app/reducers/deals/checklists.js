import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_CHECKLISTS:
      return action.checklists

    default:
      return state
  }
}
