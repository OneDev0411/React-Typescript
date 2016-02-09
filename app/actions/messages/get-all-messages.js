// actions/get-all-messages.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import async from 'async'
export default (user, rooms) => {
  if (!rooms) return
  const new_rooms = []
  async.eachSeries(rooms, (room, callback) => {
    const params = {
      access_token: user.access_token,
      room_id: room.id,
      limit: 20,
      max_value: null
    }
    Room.getMessages(params, (err, response) => {
      // Success
      if (response.status === 'success') {
        // Reverse order to latest first...
        const messages = response.data.reverse()
        room.messages = messages
        new_rooms.push(room)
        // Set messages on current room
        const current_room = AppStore.data.current_room
        if (current_room.id === room.id) {
          delete AppStore.data.messages_loading
          AppStore.data.current_room.message_count = 20
          AppStore.data.scroll_bottom = true
          AppStore.data.messages = messages
          AppStore.emitChange()
        }
      }
      callback()
    })
  })
}