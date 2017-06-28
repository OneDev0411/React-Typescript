import types from '../../constants/chatroom'

export function addChatPopup(roomId, activate = true) {
  return {
    type: types.ADD_POPUP,
    roomId,
    activate
  }
}

export function closeChatPopup(roomId) {
  return {
    type: types.REMOVE_POPUP,
    roomId
  }
}

export function minimizeChatPopup(roomId) {
  return {
    type: types.MINIMIZE_POPUP,
    roomId
  }
}

export function maximizeChatPopup(roomId) {
  document.body.style.overflow = 'hidden'

  return {
    type: types.MAXIMIZE_POPUP,
    roomId
  }
}

export function changeActivePopup(roomId) {
  return {
    type: types.CHANGE_ACTIVE_POPUP,
    roomId
  }
}
