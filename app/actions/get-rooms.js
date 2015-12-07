// actions/get-rooms.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (user) => {
  
  const params = {
    access_token: user.access_token
  }
  
  User.getRooms(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      AppStore.data.rooms = response.data
      AppStore.data.current_room = AppStore.data.rooms[0]
    
    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.emitChange()

  })
}