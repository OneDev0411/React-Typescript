import types from '../../constants/chatroom'

export function addMessageTyping(roomId, userId) {
  return {
    type: types.ADD_MESSAGE_TYPING,
    roomId,
    userId
  }
}

export function removeMessageTyping(roomId, userId) {
  return {
    type: types.REMOVE_MESSAGE_TYPING,
    roomId,
    userId
  }
}
