import types from '../../constants/chatroom'
import _ from 'underscore'

const initialState = {
  rooms: null,
  messages: {}
}

export default (state = initialState, action) => {
  switch (action.type) {

    case types.GET_ROOMS:
      return {
        ...state,
        ...{rooms: action.rooms}
      }

    case types.GET_MESSAGES:
      const messages = {
        ...action.messages,
        ...state.messages[action.id]
      }

      return {
        ...state,
        ...{messages: {
          ...state.messages,
          ...{[action.id]: messages}
        }}
      }

    default:
      return state
  }
}
