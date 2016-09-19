// controller/chat-module.js
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  showChatBubble() {
    AppStore.data.show_chat_bubble = true
    controller.getMessages()
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
  },
  getMessages() {
    console.log('getMessages')
    AppDispatcher.dispatch({
      action: ''
    })
  }
}
export default controller