import types from '../../constants/contact'

export default (state = {}, action) => {
  switch (action.type) {
    case types.IMPORT_SUCCESSFUL_LOGIN:
      return { SuccessfulLogin: true }
    case types.IMPORT_DONE:
      return { done: true }

    default:
      return state
  }
}
