import Rx from 'rxjs/Rx'
import Socket from '../../../../../services/socket'
import ChatNotification from './notification'
import Message from '../Util/message'
import store from '../../../../../stores'
import {
  getRooms,
  getMessages,
  addMessageTyping,
  removeMessageTyping,
  initialStates,
  updateState
} from '../../../../../store_actions/chatroom'

export default class ChatSocket extends Socket {

  constructor(user) {
    super(user)

    // create an instance for chat notifications
    new ChatNotification(user)

    // bind chatroom socket events
    this.bindEvents()
  }

  bindEvents() {
    const { socket } = this

    // bind User.Typing
    socket.on('User.Typing', this.onUserTyping.bind(this))

    // bind User.TypingEnded
    socket.on('User.TypingEnded', this.onUserTypingEnded.bind(this))

    // bind Message.Sent
    socket.on('Message.Sent', this.onNewMessage.bind(this))

    // get all user states
    socket.on('Users.States', this.onUserStates)

    // on reconnect
    socket.on('reconnect', this.onReconnect.bind(this))

    // update user state
    Rx
    .Observable
    .fromEvent(socket, 'User.State', (state, user_id) => ({ state, user_id }))
    .distinctUntilChanged((p, c) => p.user_id === c.user_id && p.state === c.state )
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
    if (!list || list[message.id])
      return false

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
  onUserTyping({room_id, user_id}) {
    if (user_id !== this.user.id)
      store.dispatch(addMessageTyping(room_id, user_id))
  }

  /**
   * income socket event when user typing has been ended
   */
  onUserTypingEnded({user_id, room_id}) {
    if (user_id !== this.user.id)
      store.dispatch(removeMessageTyping(room_id, user_id))
  }

  /**
   * on reconnect
   */
  onReconnect() {
    const { activeRoom } = store.getState().chatroom

    // get rooms again
    store.dispatch(getRooms())

    // get messages of active rooms
    if (activeRoom)
      store.dispatch(getMessages(activeRoom))

    // emit connected message
    store.dispatch(changeSocketStatus('connected'))
  }
}
