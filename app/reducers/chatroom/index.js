import { combineReducers } from 'redux'
import types from '../../constants/chatroom'
import _ from 'underscore'
import moment from 'moment'

const initialState = {
  showChatbar: false,
  instanceMode: false,
  popups: {},
  rooms: null,
  messages: {}
}

function updateRoom(state, roomId, attributes) {
  return {
    ...state.rooms,
    ...{[roomId]: {
      ...state.rooms[roomId],
      ...attributes
    }}
  }
}

/**
 * change active room
 */
function changeActiveRoom(state, action) {
  return {
    ...state,
    ...{ activeRoom: action.roomId }
  }
}

/**
 * open/close side bar
 */
function toggleChatbar(state, action) {
  return {
    ...state,
    ...{ showChatbar: !state.showChatbar }
  }
}

/**
 * enter in or close from instance mode
 */
function toggleInstanceMode(state, action) {
  // make under layer scroll hidden on fullscreen mode
  document.body.style.overflow = state.instanceMode ? '' : 'hidden'

  return {
    ...state,
    ...{ instanceMode: !state.instanceMode }
  }
}

/**
 * get list of rooms
 */
function getRooms(state, action) {
  return {
    ...state,
    ...{rooms: action.rooms}
  }
}

/**
 * create new room
 */
function createRoom(state, action) {
  return {
    ...state,
    ...{showChatbar: false},
    ...{rooms: {
      ...state.rooms,
      ...{[action.room.id]: action.room}
    }}
  }
}

/**
 * add new member(s) to specific room
 */
function addRoomMembers(state, action) {
  const room = state.rooms[action.roomId]

  // merge current users and new users and then remove dulicates
  const users = _.uniq(room.users.concat(action.users), user => user.id)

  return {
    ...state,
    ...{rooms: {
      ...state.rooms,
      ...{[action.roomId]: {
        ...room,
        ...{users}
      }}
    }}
  }
}

/**
 * leave or delete a room
 */
function leaveRoom(state, action) {
  const rooms = _.omit(state.rooms, room => room.id === action.roomId)
  const messages = _.omit(state, (messages, roomId) => roomId === action.roomId)
  const popups = _.omit(state.popups, (settings, roomId) => roomId === action.roomId)

  return {
    ...state,
    ...{activeRoom: null},
    ...{activePopup: state.activePopup === action.roomId ? null : state.activePopup},
    ...{popups},
    ...{rooms},
    ...{messages}
  }
}

/**
 * update room notification counter when receive a new message
 */
function updateRoomNotifications(state, action) {
  const { new_notifications } = state.rooms[action.roomId]

  const rooms = updateRoom(state, action.roomId, {
    new_notifications: new_notifications + 1,
    updated_at: (new Date).getTime(),
    latest_message: action.message
  })

  return {
    ...state,
    ...{rooms}
  }
}

/**
 * reset room notification counter when read all messages
 */
function resetRoomNotificationsCounter(state, action) {
  const rooms = updateRoom(state, action.roomId, {
    new_notifications: 0
  })

  return {
    ...state,
    ...{rooms}
  }
}

/**
 * acknowledge room for an specific user
 */
function acknowledgeRoom(state, action) {
  const messages = state.messages[action.roomId]

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

    if (!acked_by)
      acked_by = [action.userId]
    else
      acked_by.push(action.userId)

    ackList[message.id] = {
      ...message,
      ...{acked_by}
    }
  }

  // contact messages
  const messagesList = {
    ...messages.list,
    ...ackList
  }

  return {
    ...state,
    ...{messages: {
      ...state.messages,
      ...{[action.roomId]: {
        ...messages,
        ...{list: messagesList}
      }}
    }}
  }
}

/**
 * get or create messages
 */
function createMessages(state, action) {
  const messages = state.messages[action.id]

  let rooms = state.rooms

  // get list of messages of current room
  let list = messages && messages.list ? messages.list : {}

  // create new message
  if (action.append) {
    list = { ...list, ...action.messages }

    // update room's updated_at flag
    rooms = updateRoom(state, action.id, {
      updated_at: (new Date).getTime()
    })
  }
  // load previous messages into store
  else {
    list = { ...action.messages, ...list }
  }

  // remove queued message
  if (action.queueId) {
    list = _.omit(list, msg => msg.id === action.queueId)
  }

  // total += 1
  if (messages && action.increaseTotal)
    messages.total += 1

  return {
    ...state,
    ...{rooms},
    ...{messages: {
      ...state.messages,
      ...{[action.id]: {
        ...state.messages[action.id],
        ...action.info,
        ...{ list }
      }}
    }}
  }
}

/**
 * update message deliveries that come from socket [Notification.Delivered]
 */
function updateMessageDeliveries(state, action) {
  const messages = state.messages[action.roomId]
  const message = messages.list[action.messageId]

  let deliveries = message.deliveries
  if (!deliveries)
    deliveries = [action.deliveryInfo]
  else
    deliveries.push(action.deliveryInfo)

  return {
    ...state,
    ...{messages: {
      ...state.messages,
      ...{[action.roomId]: {
        ...messages,
        ...{list: {
          ...messages.list,
          ...{[action.messageId]: {
            ...messages.list[action.messageId],
            ...{deliveries}
          }}
        }}
      }}
    }}
  }
}

/**
 * add "user is typing" for a specific room
 */
function addMessageTyping(state, action) {
  const user = _.find(state.rooms[action.roomId].users, user => user.id === action.userId )
  const rooms = updateRoom(state, action.roomId, {
    typing: {
      ...state.rooms[action.roomId].typing,
      ...{[action.userId]: user}
    }
  })

  return {
    ...state,
    ...{rooms}
  }
}

/**
 * remove "user is typing"
 */
function removeMessageTyping(state, action) {
  const typing = _.omit(state.rooms[action.roomId].typing, user => user.id === action.userId)

  const rooms = updateRoom(state, action.roomId, { typing })

  return {
    ...state,
    ...{rooms}
  }
}

/**
 * add new chat popup
 */
function addPopup(state, action) {
  const activeRoom = action.activate ? action.roomId : state.activeRoom

  return {
    ...state,
    ...{activeRoom},
    popups: {
      ...state.popups,
      ...{[action.roomId]: {
        minimize: false
      }}
    }
  }
}

/**
 * minimize chat popup
 */
function minimizePopup(state, action) {
  let activeRoom = state.activeRoom
  const { minimize } = state.popups[action.roomId]

  // minimizing a popup
  if (minimize === false && action.roomId === activeRoom) {
    activeRoom = null
  }

  // make room active on exiting minimize
  if (minimize === true)
    activeRoom = action.roomId

  return {
    ...state,
    ...{activeRoom},
    popups: {
      ...state.popups,
      ...{[action.roomId]: {
        minimize: !minimize
      }}
    }
  }
}

/**
 * maximize chat popup
 */
function maximizePopup(state, action) {
  return {
    ...state,
    ...{
      activeRoom: action.roomId,
      instanceMode: true
    },
    popups: {
      ...state.popups,
      ...{[action.roomId]: {
        minimize: false,
        maximize: true
      }}
    }
  }
}

/**
 * remove chat popup
 */
function removePopup(state, action) {
  let activeRoom = state.activeRoom === action.roomId ? null : state.activeRoom

  /**
  * when user closes a popup:
  * if the room was active and there are more that one popups then
  * make first popup active
  */
  if (activeRoom === null && _.size(state.popups) >= 2) {
    const rooms = Object
      .keys(state.popups)
      .filter(room => room !== action.roomId)

    activeRoom = rooms[0]
  }

  return {
    ...state,
    ...{ activeRoom },
    ...{
      popups: _.omit(state.popups, (settings, roomId) => roomId === action.roomId)
    }
  }
}

/**
 * change active popup window
 */
function changeActivePopup(state, action) {
  return {
    ...state,
    ...{
      activeRoom: action.roomId
    }
  }
}

/**
 * initial user statuses
 */
function initialUserStates(state, action) {
  return {
    ...state,
    ...{ states: action.states }
  }
}

/**
 * update user state
 */
function updateUserState(state, action) {
  if (!state.states)
    return state

  return {
    ...state,
    states: {
      ...state.states,
      ...{[action.userId]: {
        ...state.states[action.userId],
        ...{
          state: action.state,
          last_seen_at: action.state === 'Offline' ? moment().format('X') : null
        }
      }}
    }
  }
}

export default (state = initialState, action) => {
  const handlers = {
    [types.CHANGE_ACTIVE_ROOM]: changeActiveRoom,
    [types.TOGGLE_CHATBAR]: toggleChatbar,
    [types.TOGGLE_INSTANCE_MODE]: toggleInstanceMode,
    [types.GET_ROOMS]: getRooms,
    [types.CREATE_ROOM]: createRoom,
    [types.ADD_MEMBERS]: addRoomMembers,
    [types.LEAVE_ROOM]: leaveRoom,
    [types.ACKNOWLEDGE_ROOM]: acknowledgeRoom,
    [types.GET_MESSAGES]: createMessages,
    [types.CREATE_MESSAGE]: createMessages,
    [types.ADD_MESSAGE_TYPING]: addMessageTyping,
    [types.REMOVE_MESSAGE_TYPING]: removeMessageTyping,
    [types.ADD_POPUP]: addPopup,
    [types.MINIMIZE_POPUP]: minimizePopup,
    [types.MAXIMIZE_POPUP]: maximizePopup,
    [types.REMOVE_POPUP]: removePopup,
    [types.CHANGE_ACTIVE_POPUP]: changeActivePopup,
    [types.INITIAL_USER_STATES]: initialUserStates,
    [types.UPDATE_USER_STATE]: updateUserState,
    [types.UPDATE_ROOM_NOTIFICATIONS]: updateRoomNotifications,
    [types.RESET_ROOM_NOTIFICATIONS]: resetRoomNotificationsCounter,
    [types.UPDATE_MESSAGE_DELIVERIES]: updateMessageDeliveries
  }

  return handlers[action.type] ? handlers[action.type](state, action) : state
}
