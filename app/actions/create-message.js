// actions/create-message.js
import Message from '../models/Message'
import AppStore from '../stores/AppStore'

export default (user, room, comment) => {
  
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
      
      const new_message = response.data
      AppStore.data.messages.unshift(new_message)
    
    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.emitChange()

  })
}