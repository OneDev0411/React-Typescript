import { increaseShowingTotalNotificationCount } from 'actions/showings'

import store from '../../../stores'

import Socket from '..'

export default class ShowingSocket extends Socket {
  constructor(user) {
    super(user)

    // bind socket events
    window.socket.on('Notification', this.OnNewNotification)
  }

  OnNewNotification = (notification: INotification) => {
    if (notification.object_class === 'ShowingAppointment') {
      store.dispatch(increaseShowingTotalNotificationCount())
    }
  }
}
