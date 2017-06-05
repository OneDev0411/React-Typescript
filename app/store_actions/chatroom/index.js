import getRooms from './get-rooms'
import getMessages from './get-messages'
import createMessage from './create-message'
import toggleChatbar from './toggle-chatbar'
import toggleFullScreen from './toggle-fullscreen'
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

export {
  getRooms,
  getMessages,
  createMessage,
  changeActiveRoom,
  toggleChatbar,
  toggleFullScreen,

  /* actions for popup */
  addChatPopup,
  closeChatPopup,
  minimizeChatPopup,
  maximizeChatPopup,
  changeActivePopup,

  /* message typing */
  addMessageTyping,
  removeMessageTyping
}
