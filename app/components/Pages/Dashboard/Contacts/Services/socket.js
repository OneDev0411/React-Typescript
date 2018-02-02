import Socket from '../../../../../services/socket'
import store from '../../../../../stores'

import {
  loginSusseful,
  importDone,
  importFail
} from '../../../../../store_actions/contact'

export default class ContactSocket extends Socket {
  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    socket.on('importDone', () => store.dispatch(importDone()))

    socket.on('importSuccesfullLogin', () => store.dispatch(loginSusseful()))
    socket.on('importFail', () => store.dispatch(importFail()))
  }
}
