import getRooms from './get-rooms'
import getMessages from './get-messages'
import createMessage from './create-message'
import toggleChatbar from './toggle-chatbar'
import toggleInstanceMode from './toggle-instance-mode'
import changeActiveRoom from './change-active-room'

import {
  addChatPopup,
  closeChatPopup,
  minimizeChatPopup,
  maximizeChatPopup,
  changeActivePopup,
} from './popups'

import {
  addMessageTyping,
  removeMessageTyping
} from './typing'

import {
  initialStates,
  updateState
} from './state'

export {
  getRooms,
  getMessages,
  createMessage,
  changeActiveRoom,
  toggleChatbar,
  toggleInstanceMode,

  /* actions for popup */
  addChatPopup,
  closeChatPopup,
  minimizeChatPopup,
  maximizeChatPopup,
  changeActivePopup,

  /* message typing */
  addMessageTyping,
  removeMessageTyping,

  /* user states */
  initialStates,
  updateState
}
