import { combineReducers } from 'redux'

import messages from './message'
import rooms from './room'
import states from './user'

const appReducer = combineReducers({
  messages,
  rooms,
  states
})

export default (state, action) => {
  return appReducer(state, action)
}
