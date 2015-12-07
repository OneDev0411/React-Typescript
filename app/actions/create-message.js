// actions/create-message.js
import Room from '../models/Room'
import AppStore from '../stores/AppStore'

export default (comment, room, user) => {
  
  const params = {
    room_id: room.id,
    comment: comment,
    message_type: 'TopLevel',
    author: user.id,
    access_token: user.access_token
  }
  
  Message.create(params, (err, response) => {
    
    // Success
    if(response.status == 'success'){
      
      AppStore.data.messages = response.data
    
    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.emitChange()

  })
}