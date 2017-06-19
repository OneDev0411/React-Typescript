import { combineReducers } from 'redux'
import types from '../../constants/chatroom'
import _ from 'underscore'

const initialState = {
  status: 'connecting',
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
 * change room status
 */
function changeStatus(state, action) {
  return {
    ...state,
    ...{ status: action.status }
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
    ...{rooms: {
      ...state.rooms,
      ...{[action.room.id]: action.room}
    }}
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
  return {
    ...state,
    ...{activeRoom: action.roomId},
    popups: {
      ...state.popups,
      ...{[action.roomId]: {
        minimize: false,
        isActive: _.size(state.popups) === 0
      }}
    }
  }
}

/**
 * minimize chat popup
 */
function minimizePopup(state, action) {
  return {
    ...state,
    popups: {
      ...state.popups,
      ...{[action.roomId]: {
        minimize: !state.popups[action.roomId].minimize
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
      activePopup: action.roomId,
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
  return {
    ...state,
    ...{
      popups: _.omit(state.popups, (settings, roomId) => roomId === action.roomId)
    }
  }
}

/**
 * change active popup window
 */
function changeActivePopup(state, action) {
  const popups = {}

  _.each(state.popups, (settings, roomId) => {
    popups[roomId] = {
      ...state.popups[roomId],
      ...{isActive: roomId === action.roomId}
    }
  })

  return {
    ...state,
    ...{ popups }
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
        ...{state: action.state}
      }}
    }
  }
}

export default (state = initialState, action) => {
  const handlers = {
    [types.CHANGE_STATUS]: changeStatus,
    [types.CHANGE_ACTIVE_ROOM]: changeActiveRoom,
    [types.TOGGLE_CHATBAR]: toggleChatbar,
    [types.TOGGLE_INSTANCE_MODE]: toggleInstanceMode,
    [types.GET_ROOMS]: getRooms,
    [types.CREATE_ROOM]: createRoom,
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
    [types.RESET_ROOM_NOTIFICATIONS]: resetRoomNotificationsCounter
  }

  return handlers[action.type] ? handlers[action.type](state, action) : state
}
