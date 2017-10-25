import types from '../../constants/deals'

export default (state = {}, action) => {
  switch (action.type) {
    case types.SET_EDIT_FORM:
      return {
        task: action.task
      }

    default:
      return state
  }
}
