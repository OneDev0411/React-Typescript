// actions/get-rooms.js
import User from '../models/User'
import AppStore from '../stores/AppStore'

export default (access_token) => {
  
  const params = {
    access_token: access_token
  }
  
  User.getRooms(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      AppStore.data.rooms = response.data
    
    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.emitChange()

  })
}