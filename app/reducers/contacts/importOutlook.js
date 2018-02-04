import types from '../../constants/contact'

export default (state = {}, action) => {
  switch (action.type) {
    case types.IMPORT_SUCCESSFUL_LOGIN:
      return {
        SuccessfulLogin: true
      }
    case types.IMPORT_FAIL_LOGIN:
      return {
        failLogin: true
      }
    case types.IMPORT_DONE:
      return {
        done: true
      }
    case types.REMOVE_IMPORT_RESULT:
      return {}
    default:
      return state
  }
}
