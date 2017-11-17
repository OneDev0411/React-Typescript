import types from '../../constants/chatroom'
import _ from 'underscore'
import Cookies from 'universal-cookie'

const cookies = new Cookies()
const initialState = cookies.get('popups')

// console.log('initialState: ', initialState)

export default (state = {}, action) => {
  switch (action.type) {
    case types.GET_ROOMS: {
      let opensPopups = Object.assign({}, cookies.get('popups'), state)

      opensPopups && Object.keys(opensPopups).forEach(key => {
        if (!action.rooms[key]) {
          delete opensPopups[key]
        }
      })

      return opensPopups
    }

    case types.ADD_POPUP: {
      const nextState = {
        ...state,
        ...{
          [action.roomId]: {
            minimize: false
          }
        }
      }

      cookies.set('popups', nextState)

      return nextState
    }

    case types.MINIMIZE_POPUP: {
      const nextState = {
        ...state,
        ...{
          [action.roomId]: {
            minimize: !state[action.roomId].minimize
          }
        }
      }

      cookies.set('popups', nextState)

      return nextState
    }
    case types.MAXIMIZE_POPUP: {
      const nextState = {
        ...state,
        ...{
          [action.roomId]: {
            minimize: false,
            maximize: true
          }
        }
      }

      cookies.set('popups', nextState)

      return nextState
    }
    case types.REMOVE_POPUP: {
      const nextState = _.omit(state, (settings, roomId) => roomId === action.roomId)

      cookies.set('popups', nextState)

      return nextState
    }
    default:
      return state
  }
}
