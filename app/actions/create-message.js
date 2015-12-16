// actions/create-message.js
import AppStore from '../stores/AppStore'
import config from '../../config/public'

export default (user, room, comment) => {
  // Socket
  const socket = io(config.socket.server)
  socket.emit('authenticate', user.access_token)
  let message = {
    comment: comment,
    message_type:'TopLevel'
  }
  socket.emit('new message', room.id, message)
}