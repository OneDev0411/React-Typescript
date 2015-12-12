// actions/get-rooms.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

// Get messages
import getMessages from './get-messages'

export default (user) => {
  
  const params = {
    access_token: user.access_token
  }
  
  User.getRooms(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      let rooms = response.data
      AppStore.data.rooms = rooms
      
      // Get messages for current room
      let current_room = rooms[0]
      AppStore.data.current_room = current_room
      let user = AppStore.data.user
      getMessages(user, current_room)

    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.emitChange()

  })
}