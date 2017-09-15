import io from 'socket.io-client'
import store from '../../stores'
import { changeSocketStatus } from '../../store_actions/socket'

import config from '../../../config/public'

// create socket
const socket = io(config.socket.server, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999
})

export default class Socket {
  static authenicated = false

  constructor(user) {
    // set user
    this.user = user

    // bind socket to window
    window.socket = this.socket = socket

    // create authentication
    Socket.authenicate(user)

    // bind Reconnecting and Reconnect socket
    socket.on('reconnecting', this.onReconnecting.bind(this))
    socket.on('reconnect', this.onReconnect.bind(this))

    // bind ping
    socket.on('ping', this.onPing)
  }

  /**
   * authenticate user
   */
  static authenicate(user) {
    if (!user || !user.access_token) {
      console.error('Can not authenticate user socket')
      return false
    }

    socket.emit('Authenticate', user.access_token, (err, user) => {
      if (err || !user)
        return false

      store.dispatch(changeSocketStatus('connected'))
      Socket.authenicated = true
    })
  }

  /**
   * on reconnecting
   */
  onReconnecting() {
    store.dispatch(changeSocketStatus('reconnecting'))
  }

  /**
   * on reconnect
   */
  onReconnect() {
    // authenticate again
    Socket.authenicate(this.user)

    // emit connected message
    store.dispatch(changeSocketStatus('connected'))
  }

  /**
   * on ping
   */
  onPing(callback) {
    if (!callback) return false
    callback(null, new Date())
  }
}
