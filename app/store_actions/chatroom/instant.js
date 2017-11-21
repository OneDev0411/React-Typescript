import types from '../../constants/chatroom'

export function toggleChatbar(show) {
  return {
    type: types.TOGGLE_CHATBAR,
    show
  }
}

export function toggleInstantMode() {
  return {
    type: types.TOGGLE_INSTANT_MODE
  }
}
