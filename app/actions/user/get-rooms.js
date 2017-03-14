// actions/get-rooms.js
import User from '../../models/User'
import _ from 'lodash'
import helpers from '../../utils/helpers'
import AppStore from '../../stores/AppStore'
import ListingDispatcher from '../../dispatcher/ListingDispatcher'

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
      if (rooms.length) {
        // remove personal room
        rooms = rooms.filter(room => {
          return room.room_type !== 'Personal'
        })
        // sort by latest message
        rooms = _.sortBy(rooms, room => {
          if (room.latest_message)
            return -room.latest_message.created_at
        })
        let current_room = rooms[0]
        if (room_id)
          current_room = _.find(rooms, { id: room_id })
        AppStore.data.rooms = rooms
        // Don't show default room if creating new message view
        if (!AppStore.data.show_new_message_viewer)
          AppStore.data.current_room = current_room
        // If going to show alert
        const alert = helpers.getParameterByName('alert')
        if (alert) {
          AppStore.data.show_alert_modal = true
          ListingDispatcher.dispatch({
            action: 'get-alert-room',
            user,
            room_id: current_room.id,
            alert_id: alert
          })
        }
        // Get messages for current room
        getAllMessages(user, rooms)
      } else {
        // Delete last room
        AppStore.data.rooms_loaded = true
        delete AppStore.data.rooms
        delete AppStore.data.current_room
      }
      if (!rooms.length)
        AppStore.data.show_create_chat_viewer = true
    }
    delete AppStore.data.loading
    AppStore.emitChange()
  })
}

// spirony+101@gmail.com