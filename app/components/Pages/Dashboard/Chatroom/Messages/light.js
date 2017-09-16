import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { getMessages } from '../../../../../store_actions/chatroom'
import MessageItem from './message-item'

class Messages extends React.Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { roomId, messages } = this.props

    // initialize chatroom with latest room
    if (roomId && !messages[roomId]) {
      this.loadMessages(roomId)
    }
  }

  componentWillReceiveProps(nextProps) {
    const { roomId, messages } = nextProps

    if (roomId && !messages[roomId]) {
      return this.loadMessages(roomId)
    }
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

  /**
   * fetch messages
   */
  async loadMessages(roomId, limit = 10000, max_value = null, scroll_to = null) {
    const { getMessages } = this.props

    if (!roomId) {
      return false
    }

    // fetch
    await getMessages(roomId, limit, max_value)
  }

  render() {
    const { roomId, user, deliveryReportPlacement } = this.props

    // get messages of current room
    const messages = roomId ? this.props.messages[roomId] : null

    return (
      <div
        className="messages"
      >
        {
          roomId && !messages &&
          <img
            className="loading"
            src="/static/images/loading-states/messages.svg"
          />
        }

        <div className="messages-list">
          {
            messages &&
            _.map(messages.list, msg =>
              <div key={`MESSAGE_${msg.id}`}>
                <MessageItem
                  user={user}
                  roomId={roomId}
                  message={msg}
                  previousMessage={this.getPreviousMessage(messages.list, msg)}
                  deliveryReportPlacement={deliveryReportPlacement}
                />
              </div>
            )
          }
        </div>

      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  messages: chatroom.messages
}), ({ getMessages }))(Messages)
