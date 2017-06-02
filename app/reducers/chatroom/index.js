import types from '../../constants/chatroom'
import _ from 'underscore'

const initialState = {
  showChatbar: false,
  fullscreen: false,
  popups: {},
  rooms: null,
  messages: {}
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.CHANGE_ACTIVE_ROOM:
      return {
        ...state,
        ...{ activeRoom: action.roomId }
      }

    case types.TOGGLE_CHATBAR:
      return {
        ...state,
        ...{ showChatbar: !state.showChatbar }
      }

    case types.TOGGLE_FULLSCREEN:
      return {
        ...state,
        ...{ fullscreen: !state.fullscreen }
      }

    case types.GET_ROOMS:
      return {
        ...state,
        ...{rooms: action.rooms}
      }

    case types.GET_MESSAGES:
    case types.CREATE_MESSAGE:

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

    case types.ADD_POPUP:
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

    case types.MINIMIZE_POPUP:
      return {
        ...state,
        popups: {
          ...state.popups,
          ...{[action.roomId]: {
            minimize: !state.popups[action.roomId].minimize
          }}
        }
      }

    case types.MAXIMIZE_POPUP:
      return {
        ...state,
        ...{
          activePopup: action.roomId,
          fullscreen: true
        },
        popups: {
          ...state.popups,
          ...{[action.roomId]: {
            minimize: false,
            maximize: true
          }}
        }
      }

    case types.REMOVE_POPUP:
      const r_popups = _.omit(state.popups, (settings, roomId) => roomId === action.roomId)

      return {
        ...state,
        ...{popups: r_popups}
      }

    case types.CHANGE_ACTIVE_POPUP:
      const c_popups = {}

      _.each(state.popups, (settings, roomId) => {
        c_popups[roomId] = {
          ...state.popups[roomId],
          ...{isActive: roomId === action.roomId}
        }
      })

    default:
      return state
  }
}
