import NotificationService from '../../services/notification'
import types from '../../constants/chatroom'

export function addChatPopup(roomId) {
  // clear notifications of this room
  NotificationService.clear(roomId)

  return {
    type: types.ADD_POPUP,
    roomId
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
