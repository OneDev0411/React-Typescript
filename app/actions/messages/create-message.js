// actions/create-message.js
export default (user, room, comment) => {
  // Socket
  const socket = window.socket
  const message = {
    comment,
    message_type: 'TopLevel'
  }
  socket.emit('Message.Send', room.id, message)
}