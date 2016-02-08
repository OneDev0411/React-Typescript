// actions/create-message.js
export default (user, room, comment, image_url, attachment) => {
  // Socket
  const socket = window.socket
  const message = {
    comment,
    image_url,
    attachments: [attachment],
    message_type: 'TopLevel'
  }
  socket.emit('Message.Send', room.id, message)
}