import React from 'react'
import { connect } from 'react-redux'
import Rx from 'rxjs/Rx'
import _ from 'underscore'
import moment from 'moment'
import { getMessages } from '../../../../../store_actions/chatroom'
import Toolbar from './toolbar'
import Message from './message-types'

class Messages extends React.Component {
  componentDidMount() {
    const { roomId, messages } = this.props

    // bind chat's scroll event
    this.initializeScroller()

    if (roomId && !messages[roomId])
      this.loadMessages(roomId)
  }

  componentWillReceiveProps(nextProps) {
    const { roomId, messages } = nextProps

    if (roomId && !messages[roomId])
      this.loadMessages(roomId)
  }

  initializeScroller() {
    Rx
    .Observable
    .fromEvent(this.messagesList, 'scroll')
    .debounceTime(100)
    .scan(top => (window.pageYOffset || this.messagesList.scrollTop) -
      (this.messagesList.clientTop || 0), 10000)
    .filter(top => top <= 200)
    .subscribe(() => this.loadPreviousMessages())
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

    if (!messages)
      return false

    const max_value = messages[_.keys(messages)[0]].created_at
    const lastItem = this.messagesList.children[0]

    this.loadMessages(roomId, 20, max_value, lastItem)
  }

  render() {
    const { roomId, user } = this.props
    console.log('[ x ] RENDER message cmp.')

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
            _.map(messages, msg =>
              <Message
                key={`MESSAGE_${msg.id}`}
                user={user}
                message={msg}
              />
            )
          }
        </div>

        <div
          className="message-create"
        >
          ----
        </div>
      </div>
    )
  }
}

export default connect(s => ({
  messages: s.chatroom.messages
}))(Messages)
