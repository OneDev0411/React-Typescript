import instant from './instant'
import message from './message'
import room from './room'
import popup from './popup'
import state from './state'
import activeRoom from './active-room'

const ActionTypes = {}

new Array(
  ...instant,
  ...message,
  ...room,
  ...popup,
  ...state,
  ...activeRoom
)
.forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
