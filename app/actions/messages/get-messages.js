// actions/get-messages.js
import Room from '../../models/Room'
import AppStore from '../../stores/AppStore'

export default (user, room) => {

  if(!room) return

  const params = {
    access_token: user.access_token,
    room_id: room.id,
    limit: 40,
    max_value: null
  }

  Room.getMessages(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      // Reverse order to latest first...
      AppStore.data.messages = response.data.reverse()
      AppStore.data.current_room = room
    
    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.data.current_room.viewing_previous = false
    AppStore.data.current_room.showing_all = false
    AppStore.data.current_room.message_count = 20
    AppStore.data.messages_loading = false
    AppStore.emitChange()

  })
}