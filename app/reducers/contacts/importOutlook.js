import * as types from '../../constants/contacts'

export default (state = {}, action) => {
  switch (action.type) {
    case types.CONTACTS__IMPORT_SUCCESSFUL_LOGIN:
      return {
        SuccessfulLogin: true
      }
    case types.CONTACTS__IMPORT_FAIL_LOGIN:
      return {
        failLogin: true
      }
    case types.CONTACTS__IMPORT_DONE:
      return {
        done: true
      }
    case types.CONTACTS__REMOVE_IMPORT_RESULT:
      return {}
    default:
      return state
  }
}
