// actions/create-message.js
import AppStore from '../../stores/AppStore'
import config from '../../../config/public'

// Socket.io
import io from 'socket.io-client'

export default (user, room, comment) => {
  // Socket
  const socket = io(config.socket.server)
  let message = {
    comment: comment,
    message_type:'TopLevel'
  }
  socket.emit('Message.Send', room.id, message)
}