import _ from 'underscore'
import moment from 'moment'
import types from '../../constants/chatroom'
import Chatroom from '../../models/Chatroom'

function _getMessages (id, messages, { total }) {
  return {
    type: types.GET_MESSAGES,
    id,
    messages,
    info: { total }
  }
}

export function getMessages (id, limit, max_value) {
  return async (dispatch) => {
    const response = await Chatroom.getMessages(id, limit, max_value)
    const { info, data } = response.body
    const messages = _.indexBy(data.reverse(), 'id')
    dispatch(_getMessages(id, messages, info))
  }
}


export function createMessage (id, message, queueId) {
  return {
    type: types.CREATE_MESSAGE,
    append: true,
    increaseTotal: true,
    id,
    messages: message,
    queueId
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
