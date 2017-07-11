import { combineReducers } from 'redux'
import instantMode from './instant'
import showChatbar from './chatbar'
import messages from './message'
import popups from './popup'
import rooms from './room'
import states from './user'
import activeRoom from './active-room'

const appReducer = combineReducers({
  activeRoom,
  instantMode,
  showChatbar,
  messages,
  popups,
  rooms,
  states
})

export default (state, action) => {
  return appReducer(state, action)
}
