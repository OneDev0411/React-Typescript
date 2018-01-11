import types from '../../constants/chatroom'

export default (state = false, action) => {
  switch (action.type) {
    case types.TOGGLE_CHATBAR:
      if (window && window.isSet) {
        return window.isSet(action.show) ? action.show : !state
      }

      return false

    default:
      return state
  }
}
