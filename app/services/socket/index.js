import io from 'socket.io-client'
import config from '../../../config/public'

export default class Socket {
  constructor(user) {
    this.user = user

    const socket = io(config.socket.server, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999
    })

    // create authentication
    if (user)
      socket.emit('Authenticate', user.access_token)

    window.socket = socket
  }
}
