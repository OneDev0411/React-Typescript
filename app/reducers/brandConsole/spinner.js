import types from '../../constants/brandConsole'

export default (state = false, action) => {
  switch (action.type) {
    case types.SHOW_SPINNER:
      return true
    case types.HIDE_SPINNER:
      return false
    default:
      return state
  }
}
