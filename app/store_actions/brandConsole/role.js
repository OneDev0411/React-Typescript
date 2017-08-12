import _ from 'underscore'
import moment from 'moment'
import types from '../../constants/brandConsole'
import BrandConsole from '../../models/BrandConsole'

function _getRoles(roles) {
  return {
    type: types.GET_ROLES,
    roles
  }
}

export function getRoles(user) {

  return async (dispatch) => {
    const response = await BrandConsole.getRoles(user)
    if (response) {
      const { data } = response.body
      dispatch(_getRoles(data))
    }
  }
}

export function createMessage(id, message, queueId) {
  return {
    type: types.CREATE_MESSAGE,
    append: true,
    increaseTotal: true,
    id,
    messages: message,
    queueId
  }
}

export function updateMessage(roomId, message) {
  return {
    type: types.UPDATE_MESSAGE,
    message,
    roomId
  }
}

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

export function removeRoomMessages(roomId) {
  return {
    type: types.REMOVE_ROOM_MESSAGES,
    roomId
  }
}

export function updateMessageDeliveries(user, delivery_type, notification) {
  const { room, object, notification_type } = notification

  const deliveryInfo = {
    user,
    delivery_type,
    created_at: moment.unix(notification.created_at).format(),
    type: notification_type
  }

  return {
    type: types.UPDATE_MESSAGE_DELIVERIES,
    roomId: room,
    messageId: object,
    deliveryInfo
  }
}
