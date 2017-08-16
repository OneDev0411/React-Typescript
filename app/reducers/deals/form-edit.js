import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.SET_EDIT_FORM:
      return action.task

    default:
      return state
  }
}
