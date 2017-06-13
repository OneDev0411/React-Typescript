import types from '../../constants/chatroom'

export function toggleChatbar () {
  return {
    type: types.TOGGLE_CHATBAR
  }
}

export function toggleInstanceMode() {
  return {
    type: types.TOGGLE_INSTANCE_MODE
  }
}
