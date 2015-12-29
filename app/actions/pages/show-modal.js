// actions/show-modal.js
import AppStore from '../../stores/AppStore'

export default (modal_key) => {
  if (modal_key === 'create-chat')
    AppStore.data.show_create_chat_modal = true

  if (modal_key === 'invite-user')
    AppStore.data.show_invite_user_modal = true

  AppStore.emitChange()
}