import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.SET_SELECTED_TASK:
      return action.task

    default:
      return state
  }
}
