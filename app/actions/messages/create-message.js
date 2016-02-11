// actions/create-message.js
export default (user, room, comment, image_url, attachment) => {
  // Socket
  const socket = window.socket
  const message = {
    comment,
    image_url,
    message_type: 'TopLevel'
  }
  if (attachment)
    message.attachments = [attachment]
  socket.emit('Message.Send', room.id, message)
}