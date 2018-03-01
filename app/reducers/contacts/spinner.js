import * as types from '../../constants/contacts'

export default (state = false, action) => {
  switch (action.type) {
    case types.CONTACTS__SHOW_SPINNER:
      return true
    case types.CONTACTS__HIDE_SPINNER:
      return false
    default:
      return state
  }
}
