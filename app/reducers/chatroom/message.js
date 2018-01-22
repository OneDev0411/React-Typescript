import _ from 'underscore'
import types from '../../constants/chatroom'

/**
 * get or create messages
 */
function createMessages(state, action) {
  const messages = state[action.id]

  // get list of message of room
  let list = messages && messages.list ? messages.list : {}

  // create new message
  if (action.append) {
    list = { ...list, ...action.messages }
  } else {
    // load previous messages into store
    list = { ...action.messages, ...list }
  }

  // remove queued message
  if (action.queueId) {
    list = _.omit(list, msg => msg.id === action.queueId)
  }

  // total += 1
  if (messages && action.increaseTotal) {
    messages.total += 1
  }

  return {
    ...state,
    [action.id]: {
      ...state[action.id],
      ...action.info,
      list
    }
  }
}

/**
 * update specific message
 */
function updateMessage(state, action) {
  const messages = state[action.roomId]
  const message = messages[action.message.id]

  return {
    ...state,
    [action.roomId]: {
      ...messages,
      list: {
        ...messages.list,
        [action.message.id]: {
          ...message,
          ...action.message,
          updated_at: new Date().getTime()
        }
      }
    }
  }
}

/**
 * update message deliveries that come from socket [Notification.Delivered]
 */
function updateMessageDeliveries(state, action) {
  const messages = state[action.roomId]
  const message = messages.list[action.messageId]

  let deliveries = message.deliveries

  if (!deliveries) {
    deliveries = [action.deliveryInfo]
  } else {
    deliveries.push(action.deliveryInfo)
  }

  return {
    ...state,
    [action.roomId]: {
      ...messages,
      list: {
        ...messages.list,
        [action.messageId]: {
          ...messages.list[action.messageId],
          deliveries
        }
      }
    }
  }
}

/**
 * acknowledge room for an specific user
 */
function acknowledgeRoom(state, action) {
  const messages = state[action.roomId]

  const ackList = {}

  const reversed = Object.keys(messages.list).reverse()

  for (let id in reversed) {
    // get message
    const key = reversed[id]
    const message = messages.list[key]

    // get acked field
    let acked_by = message.acked_by

    // break loop on first occurance
    if (message.acked_by && message.acked_by.indexOf(action.userId) > -1) {
      break
    }

    if (!acked_by) {
      acked_by = [action.userId]
    } else {
      acked_by.push(action.userId)
    }

    ackList[message.id] = {
      ...message,
      acked_by
    }
  }

  // contact messages
  const messagesList = {
    ...messages.list,
    ...ackList
  }

  return {
    ...state,
    [action.roomId]: {
      ...messages,
      list: messagesList
    }
  }
}

/**
 * romove room messages (when user leaves room)
 */
function removeRoomMessages(state, action) {
  return _.omit(state, (messages, roomId) => roomId === action.roomId)
}

export default (state = {}, action) => {
  switch (action.type) {
    case types.GET_MESSAGES:
    case types.CREATE_MESSAGE:
      return createMessages(state, action)

    case types.UPDATE_MESSAGE:
      return updateMessage(state, action)

    case types.REMOVE_ROOM_MESSAGES:
      return removeRoomMessages(state, action)

    case types.ACKNOWLEDGE_ROOM:
      return acknowledgeRoom(state, action)

    case types.UPDATE_MESSAGE_DELIVERIES:
      return updateMessageDeliveries(state, action)

    default:
      return state
  }
}
