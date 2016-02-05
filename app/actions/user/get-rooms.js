// actions/get-rooms.js
import User from '../../models/User'
import _ from 'lodash'
import AppStore from '../../stores/AppStore'

// Get all messages
import getAllMessages from '../messages/get-all-messages'

export default (user, room_id) => {
  const params = {
    access_token: user.access_token
  }
  User.getRooms(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      const rooms = response.data
      AppStore.data.rooms = rooms
      // Get messages for current room
      let current_room = rooms[0]
      // If current room id
      if (room_id)
        current_room = _.findWhere(rooms, { id: room_id })
      AppStore.data.current_room = current_room
      getAllMessages(user, rooms)
    }
    AppStore.emitChange()
  })
}