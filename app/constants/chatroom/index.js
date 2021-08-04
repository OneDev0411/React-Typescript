import activeRoom from './active-room'
import drafts from './drafts'
import instant from './instant'
import message from './message'
import popup from './popup'
import room from './room'
import state from './state'

const ActionTypes = {}

// eslint-disable-next-line no-array-constructor
new Array(
  ...instant,
  ...message,
  ...room,
  ...popup,
  ...state,
  ...activeRoom,
  ...drafts
).forEach(action => {
  ActionTypes[action] = `CHATROOM___${action}`
})

export default ActionTypes
