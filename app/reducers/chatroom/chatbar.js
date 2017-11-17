import types from '../../constants/chatroom'

export default (state = false, action) => {
  switch (action.type) {
    case types.TOGGLE_CHATBAR:
      return window.isSet(action.show) ? action.show : !state

    default:
      return state
  }
}
