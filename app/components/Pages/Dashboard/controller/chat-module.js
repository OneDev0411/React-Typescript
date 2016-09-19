// controller/chat-module.js
import AppStore from '../../../../stores/AppStore'
const controller = {
  showChatBubble() {
    AppStore.data.show_chat_bubble = true
    AppStore.emitChange()
  },
  hideChatBubble() {
    delete AppStore.data.show_chat_bubble
    AppStore.emitChange()
  },
  handleKeyUp(e) {
    if (e.which === 13)
      controller.sendMessage()
  },
  sendMessage() {
    // do something
  }
}
export default controller