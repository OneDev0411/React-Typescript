import { EventEmitter } from 'events'
import Socket from '../socket'
import config from '../../../config/public'

// create emitter instance
const emitter = new EventEmitter()

export default class NotificationService extends Socket {
  constructor(user) {
    super(user)

    // bind Notification events
    window.socket.on('Notification', this.onNotification.bind(this))
  }

  subscribe(name, handler) {
    emitter.on(name, handler)
  }

  unsubscribe(name, handler) {
    emitter.removeListener(name, handler)
  }

  /**
   * check window is active
   */
  isWindowActive() {
    return document && document.hasFocus()
  }

  /**
   * on receive new notification [socket.on('Notification')]
   */
  onNotification(notification) {
    const { notification_type } = notification
    const chatroom = this.getChatroomStore()

    emitter.emit(notification_type, chatroom, notification)
  }

  /**
   * start sending a browser notification
   */
  sendBrowserNotification(message, onClick) {
    if (!('Notification' in window)) {
      return false
    }

    const Notification = window.Notification
      || window.mozNotification
      || window.webkitNotification

    if (Notification.permission === 'granted') {
      this.sendBrowserMessage(message, onClick)
    } else {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          this.sendBrowserMessage(message, onClick)
        }
      })
    }
  }

  /**
   * send browser notification
   */
  sendBrowserMessage(message, onClick) {
    const title = message.title || 'You have new Rechat notification'
    const icon
      = message.image || `${config.app.url}/static/images/dashboard/rebot@2x.png`
    const body = message.body || 'You have new message'

    const instance = new Notification(title, {
      body,
      icon,
      sound: `${config.app.url}/static/audio/ding.mp3`
    })

    instance.onclick = () => {
      // close notification
      instance.close()

      // focus tab
      window.focus()

      // trigger callback
      if (onClick) {
        onClick()
      }
    }
  }
}
