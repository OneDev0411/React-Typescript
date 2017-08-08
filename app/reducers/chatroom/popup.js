import types from '../../constants/chatroom'
import _ from 'underscore'

export default (state = {}, action) => {
  switch (action.type) {
    case types.ADD_POPUP:
      return {
        ...state,
        ...{[action.roomId]: {
          minimize: false
        }}
      }

    case types.MINIMIZE_POPUP:
      return {
        ...state,
        ...{[action.roomId]: {
          minimize: !state[action.roomId].minimize
        }}
      }

    case types.MAXIMIZE_POPUP:
      return {
        ...state,
        ...{[action.roomId]: {
          minimize: false,
          maximize: true
        }}
      }

    case types.REMOVE_POPUP:
      return _.omit(state, (settings, roomId) => roomId === action.roomId)

    default:
      return state
  }
}
