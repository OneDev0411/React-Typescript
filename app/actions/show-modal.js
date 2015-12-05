// actions/show-modal.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (modal_key) => {
  
  if(modal_key === 'create-chat')
    AppStore.data.showCreateChatModal = true  
  
  AppStore.emitChange()

}