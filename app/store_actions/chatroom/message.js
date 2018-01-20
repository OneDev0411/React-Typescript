import _ from 'underscore'
import moment from 'moment'
import types from '../../constants/chatroom'
import Chatroom from '../../models/Chatroom'

function messagesReceived(id, messages, { total }, append = null) {
  return {
    type: types.GET_MESSAGES,
    id,
    messages,
    append,
    info: { total }
  }
}

export function getMessages(id, limit, value, value_type) {
  return async dispatch => {
    try {
      const { info, data } = await Chatroom.getMessages(id, limit, value, value_type)

      // append messages to the end of list if using since_value
      const append = value_type === 'since'

      // reverse messages because we are displaying newest messages first
      const messages = _.indexBy(data.reverse(), 'id')

      dispatch(messagesReceived(id, messages, info, append))
    } catch (e) {
      console.log(e)
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
