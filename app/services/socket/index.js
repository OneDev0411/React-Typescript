import io from 'socket.io-client'
import moment from 'moment'
import store from '../../stores'
import { createMessage } from '../../store_actions/chatroom'
import config from '../../../config/public'

export default class Socket {
  static authenicated = false

  constructor(user) {
    const socket = io(config.socket.server, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 99999
    })

    // bind socket to window
    window.socket = socket

    // create authentication
    if (user)
      Socket.authenicate(user.access_token)

    // bind User.Typing
    socket.on('User.Typing', this.onUserTyping)

    // bind User.TypingEnded
    socket.on('User.TypingEnded', this.onUserTypingEnded)

    // bind Message.Sent
    socket.on('Message.Sent', this.onNewMessage)
  }

  /**
   * authenticate user
   */
  static authenicate(access_token) {
    socket.emit('Authenticate', access_token, (err, user) => {
      if (err) return false

      if (user && user.access_token === access_token)
        Socket.authenicated = true
    })
  }

  /**
   * emit User.Typing to server
   */
  static userIsTyping(roomId) {
    window.socket.emit('User.Typing', roomId)
  }

  /**
   * emit User.TypingEnded to server
   */
  static userTypingEnded(roomId) {
    window.socket.emit('User.TypingEnded', roomId)
  }

  /**
   * send new message
   */
  static sendMessage(roomId, message, authorName = '') {
    return new Promise((resolve, reject) => {
      const unixtime = moment().unix()
      const qid = 'queued_' + unixtime

      const tempMessage = {
        ...message,
        ...{
          id: qid,
          author: {
            abbreviated_display_name: authorName
          },
          queued: true,
          created_at: unixtime,
          updated_at: unixtime,
        }
      }

      // create temporary message
      Socket.createMessage(roomId, tempMessage)

      // resolve
      resolve(tempMessage)

      window.socket.emit('Message.Send', roomId, message, (err, message) => {
        if (err) return reject(err)
        Socket.createMessage(roomId, message, qid)
      })
    })
  }

  /**
   * on send / receive new message
   */
  onNewMessage(room, message) {
    const { messages } = store.getState().chatroom
    const list = messages[room.id].list

    // do not dispatch when message is created
    if (list && list[message.id])
      return false

    Socket.createMessage(room.id, message)
  }

  /**
   * create new message and store
   */
  static createMessage(roomId, message, queueId) {
    store.dispatch(createMessage(roomId, { [message.id]: message }, queueId))
  }

  /**
   * income event when a user started typing
   */
  onUserTyping({user_id, room_id}) {
    // console.log('>>>> IS TYPING', user_id, room_id)
  }

  /**
   * income socket event when user typing has been ended
   */
  onUserTypingEnded({user_id, room_id}) {
    // console.log('>>>> TYPING END', user_id, room_id)
  }
}
