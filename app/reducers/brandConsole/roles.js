import _ from 'underscore'
import types from '../../constants/brandConsole'

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
      [action.roomId]: {
        ...state[action.roomId],
        ...{
          users: _.uniq(state[action.roomId].users.concat(action.users), user => user.id)
        }
      }
    }
  }
}

/**
 * update room notification counter when receive a new message
 */
function updateRoomNotifications(state, action) {
  return updateRoom(state, action.roomId, {
    new_notifications: state[action.roomId].new_notifications + 1,
    updated_at: (new Date).getTime(),
    latest_message: action.message
  })
}

/**
 * update room's last modified time
 */
function updateRoomTime(state, action) {
  return updateRoom(state, action.roomId, {
    updated_at: (new Date).getTime()
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
        [action.userId]: _.find(state[action.roomId].users, user => user.id === action.userId)
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

export default (state = [], action) => {
  switch (action.type) {

    case types.GET_ROLES:
      if (action.roles)
        return action.roles
      return state
    default:
      return state
  }
}
