// actions/get-user-rooms.js
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'

// Get messages
import getMessages from '../messages/get-messages'

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
      getMessages(user, current_room)
    }
    AppStore.emitChange()
  })
}