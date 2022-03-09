import io from 'socket.io-client'

import { getTeamACL } from '@app/utils/acl'
import { ACL } from 'constants/acl'

import config from '../../../config/public'
import store from '../../stores'

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

    // create authentication
    if (Socket.authenticated === false) {
      this.authenticate()
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
  authenticate() {
    console.log('[Socket] Authenticating')

    const { user } = this

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
      this.registerBrand(store.getState().activeTeam ?? null)

      // update app store
      // store.dispatch(changeSocketStatus('connected'))
    })
  }

  /**
   * authenticate user brand
   */
  registerBrand = activeTeam => {
    console.log('[Deal Socket] Registering Brand')

    const acl = getTeamACL(activeTeam)

    if (acl.includes(ACL.DEALS) || acl.includes(ACL.BACK_OFFICE)) {
      const id = activeTeam?.brand?.id

      window.socket.emit('Brand.Register', id, err => {
        console.log('[Deal Socket]', 'Brand Registered - ', id, err)
      })
    }
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
    // store.dispatch(changeSocketStatus('Reconnecting'))
  }

  /**
   * on internet offline
   */
  onInternetOffline() {
    console.log('[Socket] Offline')
    // store.dispatch(changeSocketStatus('No Internet'))
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
    this.authenticate()

    // emit connected message
    // store.dispatch(changeSocketStatus('connected'))
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
