import instant from './instant'
import message from './message'
import room from './room'
import popup from './popup'
import state from './state'
import activeRoom from './active-room'
import drafts from './drafts'

const ActionTypes = {}

new Array(
  ...instant,
  ...message,
  ...room,
  ...popup,
  ...state,
  ...activeRoom,
  ...drafts
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
