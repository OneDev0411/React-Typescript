import _ from 'underscore'

import types from '../../constants/chatroom'

export function initialStates(states) {
  return {
    type: types.INITIAL_USER_STATES,
    states: _.indexBy(states, 'user_id')
  }
}

export function updateState(userId, state) {
  return {
    type: types.UPDATE_USER_STATE,
    userId,
    state
  }
}
