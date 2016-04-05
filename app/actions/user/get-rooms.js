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
      let rooms = response.data
      // sort my latest message
      if (rooms.length) {
        rooms = _.sortBy(rooms, room => {
          return -room.updated_at
        })
        const current_room = _.find(rooms, { id: room_id })
        AppStore.data.rooms = rooms
        AppStore.data.current_room = current_room
      }
      // Get messages for current room
      getAllMessages(user, rooms)
    }
    delete AppStore.data.loading
    AppStore.emitChange()
  })
}