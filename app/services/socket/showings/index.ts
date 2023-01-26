import Socket from '..'

export default class ShowingSocket extends Socket {
  private callback: () => void

  constructor(user: IUser, callback: () => void) {
    super(user)

    this.callback = callback
    // bind socket events
    window.socket.on('Notification', this.OnNewNotification)
  }

  OnNewNotification = (notification: INotification) => {
    if (notification.object_class === 'ShowingAppointment') {
      this.callback()
    }
  }
}
