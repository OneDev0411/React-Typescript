import io from 'socket.io-client'
import { EventEmitter } from 'events'
import store from '../../stores'
import { changeSocketStatus } from '../../store_actions/socket'
import config from '../../../config/public'

// create socket
const socket = io(config.socket.server, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionDelay: 5000,
  reconnectionDelayMax: 6000,
  reconnectionAttempts: 99999
})

export default class Socket {
  /**
   * socket authentication status
   */
  static authenticated = false

  constructor(user) {
    this.user = user

    // singleton pattern
    if (window.socket) {
      return false
    }

    // bind socket to window
    window.socket = socket

    // create emitter instance
    Socket.events = new EventEmitter()

    // create authentication
    if (Socket.authenticated === false) {
      Socket.authenticate(user)
    }

    // bind Reconnecting and Reconnect socket
    window.socket.on('reconnecting', this.onReconnecting.bind(this))
    window.socket.on('reconnect', this.onReconnect.bind(this))
    window.socket.on('disconnect', this.onDisconnected.bind(this))

    window.addEventListener('online', this.onInternetOnline.bind(this))
    window.addEventListener('offline', this.onInternetOffline.bind(this))

    // bind ping
    window.socket.on('ping', this.onPing)
  }

  /**
   * authenticate user
   */
  static authenticate(user) {
    console.log('[Socket] Authenticating')

    if (!user || !user.access_token) {
      console.error('[Socket] Can not authenticate user socket')

      return false
    }

    socket.emit('Authenticate', user.access_token, (err, response) => {
      console.log('[Socket] Authentication Done')

      if (err || !response) {
        console.log('[Socket] Authentication Failed - e: ', err)

        return false
      }

      // update authenticated flag
      Socket.authenticated = true

      // broadcast UserAuthenticated event
      Socket.events.emit('UserAuthenticated', user)

      // update app store
      store.dispatch(changeSocketStatus('connected'))
    })
  }

  /**
   * on disconnected
   */
  onDisconnected() {
    console.log('[Socket] Disconnected')
    this.onReconnecting()
  }

  /**
   * on reconnecting
   */
  onReconnecting() {
    console.log('[Socket] Reconnecting')
    store.dispatch(changeSocketStatus('Reconnecting'))
  }

  /**
   * on internet offline
   */
  onInternetOffline() {
    console.log('[Socket] Offline')
    store.dispatch(changeSocketStatus('No Internet'))
  }

  /**
   * on internet offline
   */
  onInternetOnline() {
    console.log('[Socket] Online')
    this.onReconnect()
  }

  /**
   * on reconnect
   */
  onReconnect() {
    console.log('[Socket] Reconnected')

    // authenticate again
    Socket.authenticate(this.user)

    // emit connected message
    store.dispatch(changeSocketStatus('connected'))
  }

  /**
   * on ping
   */
  onPing(callback) {
    if (!callback) {
      return false
    }

    callback(null, new Date())
  }
}
