import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { getMessages } from '../../../../../store_actions/chatroom'
import Toolbar from '../Rooms/toolbar'
import MessageItem from './message-item'
import UserTyping from '../UserTyping'
import ComposeMessage from '../ComposeMessage'
import UploadHandler from '../ComposeMessage/upload'
import SocketStatus from '../SocketStatus'

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.lastScrollTop = 0
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
    if (roomId && !messages[roomId]) {
      this.loadMessages(roomId)
    }

    // scroll to end of messages while re-loading a pop
    if (isPopup) {
      this.scrollEnd()
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { roomId, messages } = nextProps

    if (roomId && !messages[roomId]) {
      return this.loadMessages(roomId)
    }

    // room is changed
    if (roomId !== this.props.roomId) {
      this.scrollEnd()
    }

    // check if new message is received or not
    this.isNewMessageReceived(nextProps)
  }

  componentWillUnmount() {
    window.socket.removeEventListener('Message.Sent', this.messageListener)
    this.messagesObservable && this.messagesObservable.unsubscribe()
  }

  async initializeScroller() {
    const Rx = await import('rxjs/Rx' /* webpackChunkName: "rx" */)

    if (!this.messagesList) {
      console.log('Could not initialize scroller')

      return
    }

    this.messagesObservable = Rx.Observable.fromEvent(
      this.messagesList,
      'scroll'
    )
      .debounceTime(500)
      .scan(
        () => this.messagesList.scrollTop - this.messagesList.clientTop,
        10000
      )
      .filter(top => {
        // check scroll direction
        const isScrolledToTop = top < this.lastScrollTop

        // set last scroll pos
        this.lastScrollTop = top

        return isScrolledToTop && top < 90
      })
      .subscribe(top => this.loadPreviousMessages(top))
  }

  /**
   * fetch messages
   */
  async loadMessages(roomId, limit = 20, max_value = null, scroll_to = null) {
    const { getMessages } = this.props

    if (!roomId) {
      return false
    }

    // fetch
    await getMessages(roomId, limit, max_value)

    if (!this.messagesList) {
      return false
    }

    // move to end of div
    if (scroll_to === null) {
      this.messagesList.scrollTop = this.messagesList.scrollHeight
    } else {
      this.messagesList.scrollTop =
        scroll_to.offsetTop - this.messagesList.offsetTop
    }
  }

  /**
   * load previous messages of chat by scrolling to top
   * this function is a subscriber of Rxjs
   */
  loadPreviousMessages() {
    const { roomId } = this.props
    const messages = this.props.messages[roomId]

    // check whether old messages are loaded or not
    if (!messages || messages.total <= _.size(messages.list)) {
      return false
    }

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

    if (index === -1 || !keys[index - 1]) {
      return null
    }

    return messages[keys[index - 1]]
  }

  onNewMessage(room) {
    const { roomId } = this.props

    if (!this.messagesList) {
      return false
    }

    const count = this.messagesList.children.length

    if (count < 4) {
      return false
    }

    // get element
    const el = this.messagesList.children[count - 4]

    // scroll end when receive new message and in visible area
    if (this.elementInViewport(el) && room.id === roomId) {
      this.scrollEnd()
    }
  }

  /**
   * check element is in viewport or not
   */
  elementInViewport(el) {
    const top = el.offsetTop
    const height = el.offsetHeight
    const container = this.messagesList

    return (
      top >= this.messagesList.scrollTop &&
      top + height <= container.scrollTop + container.offsetHeight
    )
  }

  /**
   * scroll message area to the end
   * this timeout is a kind of hack, scrolling should start after render complete
   * and the timeout function do this
   */
  scrollEnd() {
    setTimeout(() => {
      if (this.messagesList) {
        this.messagesList.scrollTop = this.messagesList.scrollHeight
      } else {
        this.scrollEnd()
      }
    }, 200)
  }

  /**
   * get height of messages list
   * the height calculates based on compose-message height
   */
  getHeight() {
    let { composeMessageHeight } = this.state
    const { showToolbar, showComposeMessage } = this.props
    let { toolbarHeight, baseHeight } = this.props

    // `${330 - 9 - 4 - 4}px` :
    // popup height - compose message bottom - 2*input border: 330px - 9px -4px - 4px
    if (showToolbar === false) {
      toolbarHeight = '0px'
    }

    if (showComposeMessage === false) {
      composeMessageHeight = 0
    }

    return `calc(${baseHeight} - ${toolbarHeight} - ${composeMessageHeight}px)`
  }

  /**
   * check if new message is received or not
   */
  isNewMessageReceived(nextProps) {
    const { messages, roomId } = this.props

    // scroll to end if new message received
    const messageId = this.getLastMessageId(messages[roomId])
    const nextMessageId = this.getLastMessageId(nextProps.messages[roomId])

    if (messageId && messageId !== nextMessageId) {
      this.scrollEnd()
    }
  }

  /**
   * get last message id
   */
  getLastMessageId(messages) {
    if (!messages) {
      return null
    }

    const keys = Object.keys(messages.list)

    if (keys.length === 0) {
      return null
    }

    const last = keys[keys.length - 1]
    const message = messages.list[last]

    return message.id
  }

  render() {
    const {
      roomId,
      user,
      isInstantChat,
      showToolbar,
      showComposeMessage,
      disableUpload,
      onClick
    } = this.props

    // get messages of current room
    const messages = roomId ? this.props.messages[roomId] : null

    return (
      <div className="messages" onClick={onClick}>
        <SocketStatus />

        {!roomId && (
          <div className="no-room">Please select a chat to start messaging</div>
        )}

        {roomId && showToolbar && <Toolbar roomId={roomId} />}

        {roomId && !messages && (
          <img
            alt="loading"
            className="loading"
            src="/static/images/loading-states/messages.svg"
          />
        )}

        <UploadHandler
          disabled={disableUpload}
          disableClick
          roomId={roomId}
          author={user}
          dropZoneStyle={{
            width: '100%',
            height: '100%'
          }}
        >
          <div
            id={`messages-list-${roomId}`}
            className="messages-list"
            ref={ref => (this.messagesList = ref)}
            style={{
              minHeight: this.getHeight(),
              maxHeight: this.getHeight()
            }}
          >
            {messages &&
              _.map(messages.list, msg => (
                <div key={`MESSAGE_${msg.id}`}>
                  <MessageItem
                    user={user}
                    roomId={roomId}
                    message={msg}
                    previousMessage={this.getPreviousMessage(
                      messages.list,
                      msg
                    )}
                  />
                </div>
              ))}
          </div>
        </UploadHandler>

        <UserTyping roomId={roomId} />

        {roomId && showComposeMessage && (
          <ComposeMessage
            user={user}
            roomId={roomId}
            isInstantChat={isInstantChat}
            onHeightChange={height =>
              this.setState({ composeMessageHeight: height })
            }
            onComposeMessage={() => this.scrollEnd()}
          />
        )}
      </div>
    )
  }
}

Messages.defaultProps = {
  toolbarHeight: '70px',
  baseHeight: '95vh',
  showComposeMessage: true
}

export default connect(
  ({ chatroom }) => ({
    messages: chatroom.messages
  }),
  { getMessages }
)(Messages)
