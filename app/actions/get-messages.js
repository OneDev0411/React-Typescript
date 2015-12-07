// actions/get-messages.js
import Room from '../models/Room'
import AppStore from '../stores/AppStore'

export default (user, room) => {
  
  const params = {
    access_token: user.access_token,
    room_id: room.id
  }

  Room.getMessages(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      AppStore.data.messages = response.data
      AppStore.data.current_room = room
    
    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.emitChange()

  })
}