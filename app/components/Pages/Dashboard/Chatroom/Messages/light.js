import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { getMessages } from '../../../../../store_actions/chatroom'
import MessageItem from './message-item'
import SocketStatus from '../SocketStatus'

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

  UNSAFE_componentWillReceiveProps(nextProps) {
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

    if (index === -1 || !keys[index - 1]) {
      return null
    }

    return messages[keys[index - 1]]
  }

  /**
   * fetch messages
   */
  async loadMessages(roomId, limit = 10000, max_value = null) {
    const { getMessages } = this.props

    if (!roomId) {
      return false
    }

    // fetch
    await getMessages(roomId, limit, max_value)
  }

  render() {
    const {
      roomId,
      user,
      deliveryReportPlacement,
      openFilesInNewTab
    } = this.props

    // get messages of current room
    const messages = roomId ? this.props.messages[roomId] : null

    return (
      <div className="messages">
        <SocketStatus />

        {roomId && !messages && (
          <img
            className="loading"
            src="/static/images/loading-states/messages.svg"
            alt=""
          />
        )}

        {messages && _.size(messages.list) === 0 && (
          <React.Fragment>
            {this.props.emptyStateRenderer ? (
              this.props.emptyStateRenderer()
            ) : (
              <div className="no-messages">There are no messages.</div>
            )}
          </React.Fragment>
        )}

        <div className="messages-list">
          {messages &&
            _.map(messages.list, msg => (
              <div key={`MESSAGE_${msg.id}`}>
                <MessageItem
                  user={user}
                  roomId={roomId}
                  message={msg}
                  openFilesInNewTab={openFilesInNewTab}
                  previousMessage={this.getPreviousMessage(messages.list, msg)}
                  deliveryReportPlacement={deliveryReportPlacement}
                />
              </div>
            ))}
        </div>
      </div>
    )
  }
}

export default connect(
  ({ chatroom }) => ({
    messages: chatroom.messages
  }),
  { getMessages }
)(Messages)
