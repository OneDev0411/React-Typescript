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
      AppStore.data.messages.push(new_message)
      let socket = io()
      // Add room id to message
      new_message.room_id = AppStore.data.current_room.id
      socket.emit('chat message', new_message)

    } else {

      AppStore.data.errors.push('rooms')
      
    }

    AppStore.emitChange()

  })
}