import types from '../../constants/chatroom'
import moment from 'moment'

/**
 * initial user statuses
 */
function initialUserStates(action) {
  return action.states
}

/**
 * update user state
 */
function updateUserState(state, action) {
  return {
    ...state,
    [action.userId]: {
      ...state[action.userId],
      state: action.state,
      last_seen_at: null
    }
  }
}

export default (state = {}, action) => {
  switch (action.type) {
    case types.INITIAL_USER_STATES:
      return initialUserStates(action)

    case types.UPDATE_USER_STATE:
      return updateUserState(state, action)

    default:
      return state
  }
}
