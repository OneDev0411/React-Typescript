// actions/create-message.js
export default (user, room, comment, image_url, attachment, recommendation) => {
  // Socket
  const socket = window.socket
  const message = {
    comment,
    image_url,
    message_type: 'TopLevel'
  }
  if (attachment)
    message.attachments = [attachment]
  if (recommendation)
    message.recommendation = recommendation
  socket.emit('Message.Send', room.id, message)
  socket.emit('User.TypingEnded', room.id)
}