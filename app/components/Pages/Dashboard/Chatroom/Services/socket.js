import Socket from '../../../../../services/socket'
import ChatNotification from './notification'
import Message from '../Util/message'
import Chatroom from '../Util/chatroom'
import store from '../../../../../stores'
import {
  addMessageTyping,
  removeMessageTyping,
  initialStates,
  updateState
} from '../../../../../store_actions/chatroom'
import { changeSocketStatus } from '../../../../../store_actions/socket'

export default class ChatSocket extends Socket {
  constructor(user) {
    super(user)

    // create an instance for chat notifications
    new ChatNotification(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  async bindEvents() {
    const { socket } = window

    // update user state
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)

    // bind User.Typing
    socket.on('User.Typing', this.onUserTyping.bind(this))

    // bind User.TypingEnded
    socket.on('User.TypingEnded', this.onUserTypingEnded.bind(this))

    // bind Message.Sent
    socket.on('Message.Sent', this.onNewMessage.bind(this))

    // get all user states
    socket.on('Users.States', this.onUserStates)

    // on reconnect
    Rx.Observable.fromEvent(socket, 'reconnect')
      .throttleTime(20 * 1000)
      .subscribe(() => this.onReconnected())

    Rx.Observable.fromEvent(socket, 'User.State', (state, user_id) => ({
      state,
      user_id
    }))
      .distinctUntilChanged((p, c) => p.user_id === c.user_id && p.state === c.state)
      .subscribe(this.onUserState)
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
   * on send / receive new message
   */
  onNewMessage(room, message) {
    const { messages } = store.getState().chatroom
    const list = messages[room.id] ? messages[room.id].list : null

    // do not dispatch when message is created
    if (!list || list[message.id]) {
      return false
    }

    Message.create(room.id, message)
  }

  /**
   * get all states
   */
  onUserStates(states) {
    store.dispatch(initialStates(states))
  }

  /**
   * on change user state
   */
  onUserState({ state, user_id }) {
    store.dispatch(updateState(user_id, state))
  }

  /**
   * income event when a user started typing
   */
  onUserTyping({ room_id, user_id }) {
    if (user_id !== this.user.id) {
      store.dispatch(addMessageTyping(room_id, user_id))
    }
  }

  /**
   * income socket event when user typing has been ended
   */
  onUserTypingEnded({ user_id, room_id }) {
    if (user_id !== this.user.id) {
      store.dispatch(removeMessageTyping(room_id, user_id))
    }
  }

  /**
   * on reconnect
   */
  onReconnected() {
    // change socket status
    store.dispatch(changeSocketStatus('synchronizing'))

    // synchronize chatroom
    Chatroom.synchronize()

    // change socket status again
    store.dispatch(changeSocketStatus('connected'))
  }
}
