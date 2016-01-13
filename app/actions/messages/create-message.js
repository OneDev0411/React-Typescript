// actions/create-message.js
import config from '../../../config/public'

// Socket.io
import io from 'socket.io-client'

export default (user, room, comment) => {
  // Socket
  const socket = io(config.socket.server)
  const message = {
    comment,
    message_type: 'TopLevel'
  }
  socket.emit('Message.Send', room.id, message, (res) => {
    console.log(res)
  })
}