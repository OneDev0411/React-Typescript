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
      action: 'leave-room',
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
    delete AppStore.data.show_create_chat_viewer
    AppStore.data.show_new_message_viewer = true
    AppStore.emitChange()
  },
  addUsersToSearchInput(items_selected) {
    delete AppStore.data.current_room
    AppStore.emitChange()
    if (!items_selected && AppStore.data.new_message || !items_selected && AppStore.data.new_message) {
      delete AppStore.data.new_message.items_selected
      AppStore.emitChange()
      return
    }
    items_selected.forEach(item => {
      if (item.type === 'room') {
        const users = item.value.users
        users.forEach(user => {
          items_selected.push({
            label: user.first_name || user.display_name,
            value: user,
            type: 'user'
          })
        })
      }
    })
    let filtered_items_selected
    // Filter out rooms
    filtered_items_selected = items_selected.filter(item => {
      return item.type !== 'room'
    })
    // Filter out self
    filtered_items_selected = filtered_items_selected.filter(item => {
      return item.value.id !== AppStore.data.user.id
    })
    // Make unique if existing
    const unique_items_selected = []
    filtered_items_selected.forEach(item => {
      if (item.value.id) {
        if (!_.find(unique_items_selected, { 'value.id': item.value.id }))
          unique_items_selected.push(item)
      } else
        unique_items_selected.push(item)
    })
    AppStore.data.new_message = {
      items_selected: unique_items_selected
    }
    // Get a room
    const rooms = AppStore.data.rooms
    const user_ids = _.map(_.filter(unique_items_selected, { type: 'user' }), 'value.id')
    if (user_ids.length) {
      let room_found = false
      rooms.forEach(room => {
        let user_ids_room = _.map(room.users, 'id')
        user_ids_room = user_ids_room.filter(user_id => {
          return user_id !== AppStore.data.user.id
        })
        if (_.isEqual(_.sortBy(user_ids), _.sortBy(user_ids_room)))
          room_found = room
      })
      if (room_found) {
        AppStore.data.current_room = room_found
        AppStore.data.messages = _.map(_.find(AppStore.data.rooms, { id: room_found.id }), 'messages')
      }
    }
    AppStore.emitChange()
  },
  searchUsers(q) {
    const user = AppStore.data.user
    AppDispatcher.dispatch({
      action: 'search-users-new-message',
      user,
      q
    })
  },
  handleInputChange(value) {
    if (!AppStore.data.new_message)
      AppStore.data.new_message = {}
    AppStore.data.new_message.search_value = value
    AppStore.emitChange()
    // Debounce
    if (window.is_typing_timeout) {
      clearTimeout(window.is_typing_timeout)
      delete window.is_typing_timeout
    }
    // Send stopped typing event
    window.is_typing_timeout = setTimeout(() => {
      controller.searchUsers(value)
    }, 1000)
  },
  handleCancelClick() {
    delete AppStore.data.show_new_message_viewer
    AppStore.data.current_room = AppStore.data.rooms[0]
    AppStore.emitChange()
  }
}
export default controller