import io from 'socket.io-client'
import store from '../../stores'
import { changeSocketStatus } from '../../store_actions/socket'
import config from '../../../config/public'

const UNAUTHORIZED = 'unauthorized'
const AUTHENTICATING = 'authenticating'
const AUTHENTICATED = 'authenticated'

// create socket
const socket = io(config.socket.server, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999
})

export default class Socket {

  /**
   * socket authentication status
   */
  static authentication = UNAUTHORIZED

  constructor(user) {
    // set user
    this.user = user

    // bind socket to window
    window.socket = this.socket = socket

    // create authentication
    if (Socket.authentication === UNAUTHORIZED) {
      Socket.authenticate(user)
    }

    // bind Reconnecting and Reconnect socket
    socket.on('reconnecting', this.onReconnecting.bind(this))
    socket.on('reconnect', this.onReconnect.bind(this))

    // bind ping
    socket.on('ping', this.onPing)
  }

  /**
   * authenticate user
   */
  static authenticate(user) {
    if (!user || !user.access_token) {
      console.error('Can not authenticate user socket')
      return false
    }

    // set status
    Socket.authentication = AUTHENTICATING

    socket.emit('Authenticate', user.access_token, (err, user) => {

      if (err || !user) {
        // update status
        Socket.authentication = UNAUTHORIZED
        return false
      }

      // update app store
      store.dispatch(changeSocketStatus('connected'))

      // update status
      Socket.authentication = AUTHENTICATED
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
    Socket.authenticate(this.user)

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
