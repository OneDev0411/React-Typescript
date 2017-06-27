import store from '../../stores'
import {
  updateRoomNotifications,
  resetRoomNotificationsCounter,
  updateMessageDeliveries,
  acknowledgeRoom,
  addChatPopup
} from '../../store_actions/chatroom'
import Chatroom from '../../components/Pages/Dashboard/Chatroom/Util/chatroom'
import config from '../../../config/public'

export default class NotificationService {
  constructor(user) {
    this.user = user
  }

  /**
   * clear room notifications
   */
  static clear(roomId) {
    const { chatroom } = store.getState()
    const { rooms } = chatroom

    if (rooms[roomId] && ~~rooms[roomId].new_notifications === 0)
      return false

    window.socket.emit('Room.Acknowledge', roomId)
    store.dispatch(resetRoomNotificationsCounter(roomId))
  }

  static playSound() {
    const audio = document.getElementById('chatroom-new-message')

    if (audio) {
      audio.play()
    }
  }

  /**
   * get state
   */
  getChatroomStore() {
    const { chatroom } = store.getState()
    return chatroom
  }

  /**
   * on receive new notification [socket.on('Notification')]
   */
  onNotification(notification) {
    const { notification_type } = notification
    const chatroom = this.getChatroomStore()

    // notification's events
    const events = {
      'UserSentMessage': this.onReceiveMessageEvent.bind(this)
    }

    if (events[notification_type])
      events[notification_type](chatroom, notification)
  }

  /**
   * On new message event [UserSentMessage]
   */
  onReceiveMessageEvent(chatroom, notification) {
    const { room, subjects, objects } = notification
    const { activeRoom } = chatroom
    const message = objects[0]

    if (message.author && message.author.id === this.user.id)
      return false

    const isWindowActive = this.isWindowActive()

    // send browser notification if tab is not active
    if (!isWindowActive) {
      this.sendBrowserNotification({
        title: `New message from ${message.author.display_name}`,
        image: message.author.profile_image_url,
        body: message.comment
      }, () => {
        Chatroom.openChat(room)
      })
    }

    if (isWindowActive && activeRoom && room === activeRoom)
      return NotificationService.clear(room)

    if (room !== activeRoom && message.author && message.author.id !== this.user.id) {
      store.dispatch(updateRoomNotifications(room, message))

      // open chat popup but make it inactive
      Chatroom.openChat(room, false)

      NotificationService.playSound()
    }
  }

  /**
   * on notification delivers to a user
   */
  onNotificationDelivered(response) {
    const { user, delivery_type, notification } = response
    const { messages } = this.getChatroomStore()

    if (!messages[notification.room])
      return false

    store.dispatch(updateMessageDeliveries(
      user,
      delivery_type,
      notification
    ))
  }

  /**
   * on notification acknowledge by a user
   */
  onNotificationAcknowledged(ack) {
    const { messages } = this.getChatroomStore()
    const { room, user } = ack

    if (ack.user === this.user.id || !messages[room])
      return false

    store.dispatch(acknowledgeRoom(room, user))
  }

  /**
   * start sending a browser notification
   */
  sendBrowserNotification(message, onClick) {
    if (!('Notification' in window))
      return false

    const Notification = window.Notification || window.mozNotification || window.webkitNotification

    if (Notification.permission === 'granted') {
      this.sendBrowserMessage(message, onClick)
    }
    else {
      Notification.requestPermission(permission => {
        if (permission === 'granted')
          this.sendBrowserMessage(message, onClick)
      })
    }
  }


  /**
   * send browser notification
   */
  sendBrowserMessage(message, onClick) {
    const title = message.title || 'You have new Rechat notification'
    const icon = message.image || `${config.app.url}/static/images/dashboard/rebot@2x.png`
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

  isWindowActive() {
    return document && document.hasFocus()
  }
}
