import React from 'react'
import { connect } from 'react-redux'
import Rx from 'rxjs/Rx'
import _ from 'underscore'
import moment from 'moment'
import cn from 'classnames'
import { getMessages } from '../../../../../store_actions/chatroom'
import Toolbar from '../Rooms/toolbar'
import MessageItem from './message-item'
import UserTyping from '../UserTyping'
import ComposeMessage from '../ComposeMessage'

class Messages extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      composeMessageHeight: 45
    }
  }

  componentDidMount() {
    const { roomId, messages, isPopup } = this.props

    /**
     * create a reference for onNewMessage function
     * more info in https://stackoverflow.com/questions/11565471
    */
    this.messageListener = this.onNewMessage.bind(this)
    this.messagesObservable = null

    // create listener for new messages
    window.socket.addEventListener('Message.Sent', this.messageListener)

    // bind chat's scroll event
    this.initializeScroller()

    // initialize chatroom with latest room
    if (roomId && !messages[roomId])
      this.loadMessages(roomId)

    // scroll to end of messages while re-loading a pop
    if (isPopup)
      this.scrollEnd()
  }

  componentWillReceiveProps(nextProps) {
    const { roomId, messages } = nextProps

    if (roomId && !messages[roomId])
      return this.loadMessages(roomId)

    // room is changed
    if (roomId !== this.props.roomId)
      this.scrollEnd()
  }

  componentWillUnmount() {
    window.socket.removeEventListener('Message.Sent', this.messageListener)
    this.messagesObservable.unsubscribe()
  }

  initializeScroller() {
    this.messagesObservable = Rx
    .Observable
    .fromEvent(this.messagesList, 'scroll')
    .debounceTime(400)
    .scan(top => this.messagesList.scrollTop - this.messagesList.clientTop, 10000)
    .filter(top => top < 120)
    .subscribe((top) => this.loadPreviousMessages(top))
  }

  /**
   * fetch messages
   */
  async loadMessages(roomId, limit = 20, max_value = null, scroll_to = null) {
    const { getMessages } = this.props

    // fetch
    await getMessages(roomId, limit, max_value)

    // move to end of div
    if (scroll_to === null)
      this.messagesList.scrollTop = this.messagesList.scrollHeight
    else
      this.messagesList.scrollTop = scroll_to.offsetTop - this.messagesList.offsetTop
  }

  /**
   * load previous messages of chat by scrolling to top
   * this function is a subscriber of Rxjs
   */
  loadPreviousMessages(top) {
    const { roomId } = this.props
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

  /**
   * returns previous message of desired message
   */
  getPreviousMessage(messages, msg) {
    const keys = Object.keys(messages)
    const index = keys.indexOf(msg.id)

    if (index === -1 || !keys[index - 1])
      return null

    return messages[keys[index - 1]]
  }

  onNewMessage(room, message) {
    const { user, roomId } = this.props

    if (!this.messagesList)
      return false

    const count = this.messagesList.children.length

    if (count < 4)
      return false

    // get element
    const el = this.messagesList.children[count - 4]

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

  /**
   * scroll message area to the end
   * this timeout is a kind of hack, scrolling should start after render complete
   * and the timeout function do this
   */
  scrollEnd() {
    setTimeout(() => {
      this.messagesList.scrollTop = this.messagesList.scrollHeight
    }, 100)
  }

  /**
   * get height of messages list
   * the height calculates based on compose-message height
   */
  getHeight() {
    const { composeMessageHeight } = this.state
    const { isPopup } = this.props
    const toolbarHeight = isPopup ? '0px' : '70px'
    const baseHeight = isPopup ? '297px' : '95vh'

    return `calc(${baseHeight} - ${toolbarHeight} - ${composeMessageHeight}px)`
  }

  render() {
    const { roomId, user, isInstanceChat, showToolbar, onClick } = this.props

    // get messages of current room
    const messages = roomId ? this.props.messages[roomId] : null

    return (
      <div
        className="messages"
        onClick={onClick}
      >

        {
          !roomId &&
          <div className="no-room">
            Please select a chat to start messaging
          </div>
        }

        {
          roomId && showToolbar &&
          <Toolbar
            roomId={roomId}
          />
        }

        {
          roomId && !messages &&
          <img
            className="loading"
            src="/static/images/loading-states/messages.svg"
          />
        }

        <div
          className="messages-list"
          style={{
            minHeight: this.getHeight(),
            maxHeight: this.getHeight()
          }}
          ref={ref => this.messagesList = ref}
        >
          {
            messages &&
            _.map(messages.list, msg =>
              <div key={`MESSAGE_${msg.id}`}>
                <MessageItem
                  user={user}
                  roomId={roomId}
                  message={msg}
                  previousMessage={this.getPreviousMessage(messages.list, msg)}
                />
              </div>
            )
          }
        </div>

        <UserTyping
          roomId={roomId}
        />

        {
          roomId &&
          <ComposeMessage
            user={user}
            roomId={roomId}
            isInstanceChat={isInstanceChat}
            onHeightChange={(height) => this.setState({ composeMessageHeight: height })}
            onComposeMessage={() => this.scrollEnd()}
          />
        }
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  messages: chatroom.messages
}), ({ getMessages }))(Messages)
