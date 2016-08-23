// controller/recents.js
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
const controller = {
  showDeleteRoomModal() {
    AppStore.data.show_delete_room_modal = true
    AppStore.emitChange()
  },
  hideDeleteRoomModal() {
    delete AppStore.data.show_delete_room_modal
    AppStore.emitChange()
  },
  confirmDeleteRoom() {
    const data = AppStore.data
    const user = data.user
    const current_room = data.current_room
    const id = current_room.id
    AppStore.data.deleting_room = true
    AppStore.emitChange()
    AppDispatcher.dispatch({
      action: 'delete-room',
      user,
      id
    })
  },
  clearRoomSearchText() {
    delete AppStore.data.is_filtering
    delete AppStore.data.search_rooms_input
    AppStore.emitChange()
  },
  showNewMessageView() {
    console.log('showNewMessageView')
    delete AppStore.data.current_room
    AppStore.data.show_new_message_viewer = true
    AppStore.emitChange()
  }
}
export default controller