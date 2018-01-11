import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.SET_SELECTED_ROLE:
      return action.role

    default:
      return state
  }
}
