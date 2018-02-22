import _ from 'underscore'
import store from '../../../../../stores'
import Chatroom from '../Util/chatroom'
import NotificationService from '../../../../../services/notification'
import {
  fetchAndCreateExistingRoom,
  addMembersToRoom,
  updateRoomNotifications,
  resetRoomNotificationsCounter,
  updateMessageDeliveries,
  acknowledgeRoom,
  updateRoomTime
} from '../../../../../store_actions/chatroom'

export default class ChatNotification extends NotificationService {
  constructor(user) {
    super(user)

    // temporary variable to hold last room id that received notification
    this._lastRoomGotNotification = null

    const { socket } = window

    socket.on('Notification.Delivered', this.onNotificationDelivered.bind(this))
    socket.on('Room.Acknowledged', this.onNotificationAcknowledged.bind(this))

    // subscribe to notification events
    this.subscribe('UserInvitedRoom', this.onInviteRoom.bind(this))
    this.subscribe('UserSentMessage', this.onReceiveMessage.bind(this))
    this.subscribe('UserSharedListing', this.onShareSomething.bind(this))
    this.subscribe('UserCreatedAlert', this.onShareSomething.bind(this))

    // bind window focus
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', this.onFocusWindow.bind(this))
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
   * check chatroom is in router mode or not
   */
  isRouterMode() {
    return window.location.pathname.includes('/recents/')
  }

  /**
   * on focusing window
   */
  onFocusWindow() {
    const { chatroom } = store.getState()
    const { activeRoom } = chatroom

    if (activeRoom && activeRoom === this._lastRoomGotNotification) {
      ChatNotification.clear(activeRoom)
    }

    this._lastRoomGotNotification = null
  }

  /**
   * play ding sound
   */
  static playSound() {
    const audio = document.getElementById('chatroom-new-message')

    if (audio) {
      audio.play()
    }
  }

  /**
   * clear room notifications
   */
  static clear(roomId) {
    const { chatroom } = store.getState()
    const { rooms } = chatroom

    window.socket.emit('Room.Acknowledge', roomId)

    if (rooms && rooms[roomId] && ~~rooms[roomId].new_notifications === 0) {
      return false
    }

    store.dispatch(resetRoomNotificationsCounter(roomId))
  }

  /**
   * create message
   */
  async createMessage(chatroom, notification, message) {
    const { room: roomId, notification_type, auxiliary_subject } = notification
    const isDealTaskRoom = !!(
      auxiliary_subject && auxiliary_subject.type === 'deal'
    )
    const room = chatroom.rooms[roomId]
    let shouldUpdateRoomNotifications = true

    // fetch room immediately if room is not exists
    if (!room) {
      await store.dispatch(fetchAndCreateExistingRoom(roomId))
      shouldUpdateRoomNotifications = false
    }

    // don't anything when message.author is eqaual to current user
    if (message.author && message.author.id === this.user.id) {
      // when user search a listing/alert,
      // the relevant room should go to top of rooms list
      if (
        room &&
        ['UserSharedListing', 'UserCreatedAlert'].indexOf(notification_type) >
          -1
      ) {
        store.dispatch(updateRoomTime(roomId))
      }

      return false
    }

    // get active room
    const { activeRoom } = chatroom

    // set value
    this._lastRoomGotNotification = roomId

    // check window is active or not
    const isWindowActive = this.isWindowActive()

    // send notification
    if (!isWindowActive && !isDealTaskRoom) {
      this.sendNotification(message, roomId)
    }

    if (isWindowActive && activeRoom && roomId === activeRoom) {
      return ChatNotification.clear(roomId)
    }

    if (
      !isWindowActive &&
      shouldUpdateRoomNotifications &&
      activeRoom &&
      roomId === activeRoom
    ) {
      this.updateRoomNotifications(roomId, message)
    }

    if (
      roomId !== activeRoom &&
      message.author &&
      message.author.id !== this.user.id
    ) {
      if (shouldUpdateRoomNotifications) {
        this.updateRoomNotifications(roomId, message)
      }

      // open chat popup but make it inactive
      if (!this.isRouterMode() && !isDealTaskRoom && !chatroom.popups[roomId]) {
        Chatroom.openChat(roomId, false)
      }
    }
  }

  /**
   * decide to send browser notification or not
   */
  sendNotification(message, roomId) {
    let shouldSendNotification = true

    const { chatroom, data } = store.getState()
    const { user } = data
    const room = chatroom.rooms[roomId]

    if (room.room_type === 'Group') {
      const isMentioned = _.find(message.mentions, id => id === user.id)

      if (!isMentioned) {
        shouldSendNotification = false
      }
    }

    if (!shouldSendNotification) {
      return false
    }

    // play sound
    ChatNotification.playSound()

    // send browser notification if tab is not active
    this.sendBrowserNotification(
      {
        title: `New message from ${message.author.display_name}`,
        image: message.author.profile_image_url,
        body: message.comment
      },
      () => {
        Chatroom.openChat(roomId)
      }
    )
  }

  /**
   * On new message event [UserSentMessage]
   */
  async onReceiveMessage(chatroom, notification) {
    const { objects } = notification

    await this.createMessage(chatroom, notification, objects[0])
  }

  /**
   * On user share something (listing or alert)
   */
  async onShareSomething(chatroom, notification) {
    const { subjects, objects } = notification

    console.log('new share received')

    const message = {
      ...objects[0],
      ...{ author: subjects[0] }
    }

    await this.createMessage(chatroom, notification, message)
  }

  /**
   * On user invited to a new room
   */
  onInviteRoom(chatroom, notification) {
    const { rooms } = chatroom
    const { room: roomId, auxiliary_object: user } = notification

    // if user is invited to a new room, create that room
    if (user.id === this.user.id) {
      return store.dispatch(fetchAndCreateExistingRoom(roomId))
    }

    // when new user invites to a existant room
    const isExists = _.find(rooms[roomId].users, u => u.id === user.id)

    if (!isExists) {
      store.dispatch(addMembersToRoom(roomId, [user]))
    }
  }

  /**
   * on notification delivers to a user
   */
  onNotificationDelivered(response) {
    const { user, delivery_type, notification } = response
    const { messages } = this.getChatroomStore()

    // get room messages
    const roomMessages = messages[notification.room]

    const messageId = notification.object

    if (!roomMessages || !roomMessages.list[messageId]) {
      return false
    }

    store.dispatch(updateMessageDeliveries(user, delivery_type, notification))
  }

  /**
   * on notification acknowledge by a user
   */
  onNotificationAcknowledged(ack) {
    const { messages } = this.getChatroomStore()
    const { room, user } = ack

    if (ack.user === this.user.id || !messages[room]) {
      return false
    }

    store.dispatch(acknowledgeRoom(room, user))
  }

  /**
   * update notifications of specific room
   */
  updateRoomNotifications(roomId, message) {
    const { rooms } = this.getChatroomStore()

    if (!rooms[roomId]) {
      return false
    }

    store.dispatch(updateRoomNotifications(roomId, message))
  }
}
