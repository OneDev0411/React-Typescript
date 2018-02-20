import Socket from '../'
import store from '../../../stores'

import {
  importDone,
  importFail,
  loginSuccessful
} from '../../../store_actions/contacts'

export default class ContactSocket extends Socket {
  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    socket.on('importDone', () => store.dispatch(importDone()))

    socket.on('importSuccesfullLogin', () => store.dispatch(loginSuccessful()))
    socket.on('importFail', () => store.dispatch(importFail()))
  }
}
