// actions/create-message.js
import config from '../../../config/public'

export default (user, room, comment) => {
  // Socket
  const socket = window.socket
  const message = {
    comment,
    message_type: 'TopLevel'
  }
  socket.emit('Message.Send', room.id, message, (res) => {
    console.log(res)
  })
}