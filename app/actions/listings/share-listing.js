// actions/listings/share-listing.js
import Room from '../../models/Room'
import User from '../../models/User'
import AppStore from '../../stores/AppStore'
import _ from 'lodash'
import async from 'async'
import getAllMessages from '../messages/get-all-messages'
import AppDispatcher from '../../dispatcher/AppDispatcher'
export default (user, mls_number, message, rooms, users, emails, phone_numbers, notification) => {
  // Get a room
  const available_rooms = AppStore.data.rooms
  let room_found = null
  if (users.length && !emails && !phone_numbers) {
    available_rooms.forEach(room => {
      let user_ids_room = _.map(room.users, 'id')
      user_ids_room = user_ids_room.filter(user_id => {
        return user_id !== AppStore.data.user.id
      })
      if (_.isEqual(users, user_ids_room))
        room_found = room
    })
  }
  if (room_found) {
    const room_id = room_found.id
    const params = {
      access_token: user.access_token,
      message,
      rooms: [room_id],
      mls_number,
      notification
    }
    Room.createRec(params, () => {
      // Success
      delete AppStore.data.share_modal.sending_share
      delete AppStore.data.show_share_listing_modal
      AppStore.emitChange()
      if (message) {
        AppDispatcher.dispatch({
          action: 'create-message',
          user,
          room: room_found,
          comment: message
        })
      }
      User.getRooms(params, (err, res) => {
        const updated_rooms = res.data
        AppStore.data.rooms = updated_rooms
        getAllMessages(user, updated_rooms)
        AppStore.emitChange()
      })
    })
    return
  }
  // Room not found, create room
  const locals = {}
  async.series([
    callback => {
      // Create room
      const params = {
        title: '',
        owner: user.id,
        access_token: user.access_token,
        users,
        emails,
        phone_numbers
      }
      Room.create(params, (err, response) => {
        // Success
        if (response.status === 'success') {
          const new_room = response.data
          AppStore.data.status = 'success'
          AppStore.data.show_message = true
          AppStore.data.show_create_chat_modal = false
          if (!AppStore.data.rooms)
            AppStore.data.rooms = []
          AppStore.data.rooms.unshift(new_room)
          AppStore.data.current_room = new_room
          locals.current_room = new_room
          AppStore.data.current_room.messages = [new_room.latest_message]
        } else {
          AppStore.data.status = 'error'
          AppStore.data.submitting = false
          AppStore.data.show_message = true
          AppStore.data.request_error = true
        }
        delete AppStore.data.loading
        callback()
      })
    },
    () => {
      const params = {
        access_token: user.access_token,
        message,
        rooms,
        users,
        mls_number,
        emails,
        phone_numbers,
        notification
      }
      Room.createRec(params, () => {
        // Success
        delete AppStore.data.share_modal.sending_share
        delete AppStore.data.show_share_listing_modal
        AppStore.emitChange()
      })
    }
  ])
}