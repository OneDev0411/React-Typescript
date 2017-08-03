import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_TASKS:
      return action.tasks

    default:
      return state
  }
}
