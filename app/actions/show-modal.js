// actions/show-modal.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (modal_key) => {
  
  if(modal_key === 'start-chat'){
    AppStore.data.showStartChatModal = true  
  }
  
  AppStore.emitChange()

}