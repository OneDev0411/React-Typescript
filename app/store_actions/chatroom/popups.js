import types from '../../constants/chatroom'

export function addChatPopup(roomId) {
  return {
    type: types.ADD_POPUP,
    roomId
  }
}

export function removeChatPopup() {

}

export function minimizeChatPopup() {

}
