import { combineReducers } from 'redux'
import types from '../../constants/chatroom'
import _ from 'underscore'

const initialState = {
  showChatbar: false,
  instanceMode: false,
  popups: {},
  rooms: null,
  messages: {}
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
 * get or create messages
 */
function createMessages(state, action) {
  const messages = state.messages[action.id]

  // get list of messages of current room
  let list = messages && messages.list ? messages.list : {}

  if (action.append)
    list = { ...list, ...action.messages }
  else
    list = { ...action.messages, ...list }

  // remove queued message
  if (action.queueId) {
    list = _.omit(list, msg => msg.id === action.queueId)
  }

  // total += 1
  if (action.increaseTotal)
    messages.total += 1

  return {
    ...state,
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

  return {
    ...state,
    ...{rooms: {
      ...state.rooms,
      ...{[action.roomId]: {
        ...state.rooms[action.roomId],
        typing: {
          ...state.rooms[action.roomId].typing,
          ...{[action.userId]: user}
        }
      }}
    }}
  }
}

/**
 * remove "user is typing"
 */
function removeMessageTyping(state, action) {
  const typing = _.omit(state.rooms[action.roomId].typing, user => user.id === action.userId)

  return {
    ...state,
    ...{rooms: {
      ...state.rooms,
      ...{[action.roomId]: {
        ...state.rooms[action.roomId],
        ...{ typing }
      }}
    }}
  }
}
/**
 * add new chat popup
 */
function addPopup(state, action) {
  return {
    ...state,
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
    [types.CHANGE_ACTIVE_ROOM]: changeActiveRoom,
    [types.TOGGLE_CHATBAR]: toggleChatbar,
    [types.TOGGLE_INSTANCE_MODE]: toggleInstanceMode,
    [types.GET_ROOMS]: getRooms,
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
    [types.UPDATE_USER_STATE]: updateUserState
  }

  return handlers[action.type] ? handlers[action.type](state, action) : state
}
