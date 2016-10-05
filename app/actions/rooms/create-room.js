// actions/create-room.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'
import AppDispatcher from '../../dispatcher/AppDispatcher'
import async from 'async'
export default (user, users, emails, phone_numbers, message) => {
  const locals = {}

  const brand = AppStore.data.brand ? AppStore.data.brand.id : null

  async.series([
    callback => {
      // Create room
      const params = {
        title: '',
        owner: user.id,
        access_token: user.access_token,
        users,
        emails,
        phone_numbers,
        brand
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
      AppDispatcher.dispatch({
        action: 'create-message',
        user,
        room: locals.current_room,
        comment: message
      })
      window.socket.emit('Authenticate', user.access_token)
      delete AppStore.data.show_new_message_viewer
      delete AppStore.data.new_message
      AppStore.data.show_room_saved_message = true
      AppStore.emitChange()
      setTimeout(() => {
        delete AppStore.data.show_room_saved_message
        AppStore.emitChange()
      }, 3000)
    }
  ])
}