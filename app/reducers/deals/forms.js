import types from '../../constants/deals'

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_FORMS:
      return action.forms

    default:
      return state
  }
}
