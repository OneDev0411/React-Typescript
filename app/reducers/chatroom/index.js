import types from '../../constants/chatroom'
import _ from 'underscore'

const initialState = {
  showChatbar: false,
  rooms: null,
  messages: {}
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.TOGGLE_CHATBAR:
      return {
        ...state,
        ...{ showChatbar: !state.showChatbar }
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

    default:
      return state
  }
}
