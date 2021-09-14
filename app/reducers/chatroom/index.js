import { combineReducers } from 'redux'

import activeRoom from './active-room'
import showChatbar from './chatbar'
import drafts from './drafts'
import instantMode from './instant'
import messages from './message'
import popups from './popup'
import rooms from './room'
import states from './user'

const appReducer = combineReducers({
  activeRoom,
  instantMode,
  showChatbar,
  messages,
  popups,
  rooms,
  states,
  drafts
})

export default (state, action) => {
  return appReducer(state, action)
}
