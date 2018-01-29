import Socket from '../../../../../services/socket'
import store from '../../../../../stores'
import { loginSusseful, importDone } from '../../../../../store_actions/contact'

export default class ContactSocket extends Socket {
  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    socket.on('contact.importDone', () => store.dispatch(loginSusseful()))
    socket.on('contact.succesfullLogin', () => store.dispatch(importDone()))
  }
}
