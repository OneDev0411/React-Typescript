import Socket from '..'
import { receivedANotification } from '../../../store_actions/notifications/receive-a-notifications'
import store from '../../../stores'

export default class ContactSocket extends Socket {
  constructor(user) {
    super(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    socket.on('Notification', notification => {
      store.dispatch(receivedANotification(notification))
    })
  }
}
