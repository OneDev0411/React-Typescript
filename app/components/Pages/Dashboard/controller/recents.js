// controller/recents.js
import AppDispatcher from '../../../../dispatcher/AppDispatcher'
import AppStore from '../../../../stores/AppStore'
import _ from 'lodash'
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
    delete AppStore.data.current_room
    delete AppStore.data.new_message
    AppStore.data.show_new_message_viewer = true
    AppStore.emitChange()
  },
  addUsersToSearchInput(items_selected) {
    delete AppStore.data.current_room
    AppStore.emitChange()
    if (!items_selected && AppStore.data.new_message) {
      delete AppStore.data.new_message.items_selected
      AppStore.emitChange()
      return
    }
    AppStore.data.new_message = {
      items_selected
    }
    // Get a room
    const rooms = AppStore.data.rooms
    const user_ids = _.map(_.filter(items_selected, { type: 'contact' }), 'value.contact_user.id')
    let room_found = false
    rooms.forEach(room => {
      let user_ids_room = _.map(room.users, 'id')
      user_ids_room = user_ids_room.filter(user_id => {
        return user_id !== AppStore.data.user.id
      })
      if (_.isEqual(user_ids, user_ids_room))
        room_found = room
    })
    if (room_found) {
      AppStore.data.current_room = room_found
      AppStore.data.messages = _.map(_.find(AppStore.data.rooms, { id: room_found.id }), 'messages')
      AppStore.emitChange()
    }
  }
}
export default controller