import _ from 'underscore'
import types from '../../constants/chatroom'

/**
 * a helper function that updates room attribites
 */
export function updateRoom(state, roomId, attributes) {
  if (!state) {
    return state
  }

  return {
    ...state,
    ...{
      [roomId]: {
        ...state[roomId],
        ...attributes
      }
    }
  }
}

/**
 * create new room
 */
function createRoom(state, action) {
  return {
    ...state,
    ...{ [action.room.id]: action.room }
  }
}

/**
 * add new member(s) to specific room
 */
function addRoomMembers(state, action) {
  return {
    ...state,
    ...{
      [action.room.id]: {
        ...state[action.room.id],
        ...action.room
      }
    }
  }
}

/**
 * remove member from specific room
 */
function removeRoomMember(state, action) {
  const users
    = state[action.roomId].users.filter(user => user.id !== action.memberId)

  return {
    ...state,
    [action.roomId]: {
      ...state[action.roomId],
      users
    }
  }
}

/**
 * update room notification counter when receive a new message
 */
function updateRoomNotifications(state, action) {
  return updateRoom(state, action.roomId, {
    new_notifications: state[action.roomId].new_notifications + 1,
    updated_at: (new Date()).getTime(),
    latest_message: action.message
  })
}

/**
 * update room's last modified time
 */
function updateRoomTime(state, action) {
  return updateRoom(state, action.roomId, {
    updated_at: (new Date()).getTime()
  })
}

/**
 * reset room notification counter when read all messages
 */
function resetRoomNotificationsCounter(state, action) {
  return updateRoom(state, action.roomId, {
    new_notifications: 0
  })
}

/**
 * leave or delete a room
 */
function removeRoom(state, action) {
  return _.omit(state, room => room.id === action.roomId)
}

/**
 * add "user is typing" for a specific room
 */
function addMessageTyping(state, action) {
  return updateRoom(state, action.roomId, {
    typing: {
      ...state[action.roomId].typing,
      ...{
        [action.userId]:
          _.find(state[action.roomId].users, user => user.id === action.userId)
      }
    }
  })
}

/**
 * remove "user is typing"
 */
function removeMessageTyping(state, action) {
  return updateRoom(state, action.roomId, {
    typing: _.omit(state[action.roomId].typing, user => user.id === action.userId)
  })
}

export default (state = null, action) => {
  switch (action.type) {
    case types.GET_ROOMS:
      return {
        ...state,
        ...action.rooms
      }

    case types.CREATE_ROOM:
      return createRoom(state, action)

    case types.UPDATE_ROOM_TIME:
      return updateRoomTime(state, action)

    case types.ADD_MEMBERS:
      return addRoomMembers(state, action)

    case types.REMOVE_MEMBER:
      return removeRoomMember(state, action)

    case types.REMOVE_ROOM:
      return removeRoom(state, action)

    case types.UPDATE_ROOM_NOTIFICATIONS:
      return updateRoomNotifications(state, action)

    case types.RESET_ROOM_NOTIFICATIONS:
      return resetRoomNotificationsCounter(state, action)

    case types.ADD_MESSAGE_TYPING:
      return addMessageTyping(state, action)

    case types.REMOVE_MESSAGE_TYPING:
      return removeMessageTyping(state, action)

    default:
      return state
  }
}
