// actions/get-messages.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'

export default (user, room) => {
  if (!room) return
  const params = {
    access_token: user.access_token,
    room_id: room.id,
    limit: 40,
    max_value: null
  }
  Room.getMessages(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      // Reverse order to latest first...
      const messages = response.data.reverse()
      if (messages[0])
        AppStore.data.heading_date = messages[0].created_at
      AppStore.data.messages = messages
      room.messages = messages
      AppStore.data.current_room = room
      const index = _.indexOf(AppStore.data.rooms, room)
      const rooms = AppStore.data.rooms
      rooms[index] = room
      AppStore.data.rooms = rooms
    }
    AppStore.data.current_room.viewing_previous = false
    AppStore.data.current_room.showing_all = false
    AppStore.data.current_room.message_count = 20
    AppStore.data.messages_loading = false
    AppStore.data.scroll_bottom = true
    AppStore.emitChange()
  })
}