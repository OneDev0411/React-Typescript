import React from 'react'
import { connect } from 'react-redux'
import Rx from 'rxjs/Rx'
import _ from 'underscore'
import moment from 'moment'
import cn from 'classnames'
import { getMessages } from '../../../../../store_actions/chatroom'
import Toolbar from './toolbar'
import Message from './message-types'
import CreateMessage from './create-message'

class Messages extends React.Component {

  componentDidMount() {
    const { roomId, messages } = this.props

    // bind chat's scroll event
    this.initializeScroller()

    window.socket.on('Message.Sent', this.onNewMessage.bind(this))

    // initialize chatroom with latest room
    if (roomId && !messages[roomId])
      this.loadMessages(roomId)
  }

  componentWillReceiveProps(nextProps) {
    const { roomId, messages } = nextProps

    if (roomId && !messages[roomId])
      return this.loadMessages(roomId)
  }

  initializeScroller() {
    Rx
    .Observable
    .fromEvent(this.messagesList, 'scroll')
    .debounceTime(400)
    .scan(top => this.messagesList.scrollTop - this.messagesList.clientTop, 10000)
    .filter(top => top < 120)
    .subscribe((top) => this.loadPreviousMessages(top))
  }

  async loadMessages(roomId, limit = 20, max_value = null, scroll_to = null) {
    const { dispatch } = this.props

    // fetch
    await dispatch(getMessages(roomId, limit, max_value))

    // move to end of div
    if (scroll_to === null)
      scroll_to = this.messagesList.scrollHeight
    else {
      scroll_to = scroll_to.offsetTop - this.messagesList.offsetTop
    }

    this.messagesList.scrollTop = scroll_to
  }

  loadPreviousMessages(top) {
    const { dispatch, roomId } = this.props
    const messages = this.props.messages[roomId]

    // check whether old messages are loaded or not
    if (!messages || messages.total <= _.size(messages.list))
      return false

    // get key id of last chat
    const key = _.keys(messages.list)[0]

    // get max value of last chat
    const max_value = messages.list[key].created_at

    // get html element of first child
    const lastChild = this.messagesList.children[0]

    this.loadMessages(roomId, 20, max_value, lastChild)
  }

  onNewMessage(room, message) {
    const { user, roomId } = this.props
    const el = this.messagesList.children[this.messagesList.children.length - 3]
    console.log(el, this.elementInViewport(el))
    // scroll end when receive new message and in visible area
    if (this.elementInViewport(el) && room.id === roomId)
      this.scrollEnd()
  }

  elementInViewport(el) {
    const top = el.offsetTop
    const height = el.offsetHeight
    const container = this.messagesList

    return (
      top >= this.messagesList.scrollTop &&
      (top + height) <= (container.scrollTop + container.offsetHeight)
    )
  }

  scrollEnd() {
    this.messagesList.scrollTop = this.messagesList.scrollHeight
  }

  render() {
    const { roomId, user } = this.props

    // get messages of current room
    const messages = roomId ? this.props.messages[roomId] : null

    return (
      <div className="messages">

        <Toolbar
          roomId={roomId}
        />

        {
          !messages &&
          <img
            className="loading"
            src="/static/images/loading-states/messages.svg"
          />
        }
        <div
          className="messages-list"
          ref={ref => this.messagesList = ref}
        >

          {
            messages &&
            _.map(messages.list, msg =>
              <div
                className={cn('message-item', { queued: msg.queued })}
                key={`MESSAGE_${msg.id}`}
              >
                <Message
                  user={user}
                  message={msg}
                />
              </div>
            )
          }
        </div>

        <div
          className="message-create"
        >
          <CreateMessage
            user={user}
            roomId={roomId}
            onCreateNewMessage={() => this.scrollEnd()}
          />
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  messages: s.chatroom.messages
}))(Messages)
