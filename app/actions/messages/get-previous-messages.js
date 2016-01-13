// actions/get-messages.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'

export default (user, room, scroll_height) => {
  if (!room || AppStore.data.current_room.loading_previous)
    return false

  let message_count = room.message_count

  if (!message_count)
    message_count = 20

  const new_message_count = message_count + 20

  const params = {
    access_token: user.access_token,
    room_id: room.id,
    limit: new_message_count,
    max_value: null
  }

  AppStore.data.current_room.loading_previous = true
  AppStore.emitChange()

  Room.getMessages(params, (err, response) => {
    // Success
    if (response.status === 'success') {
      // Reverse order to latest first...
      AppStore.data.messages = response.data.reverse()
      AppStore.data.current_room = room
    }

    if (new_message_count > AppStore.data.messages.length)
      AppStore.data.current_room.showing_all = true

    AppStore.data.current_room.message_count = new_message_count
    AppStore.data.current_room.viewing_previous = true
    AppStore.data.current_room.scroll_height = scroll_height + 60
    delete AppStore.data.current_room.loading_previous
    AppStore.emitChange()
  })
}