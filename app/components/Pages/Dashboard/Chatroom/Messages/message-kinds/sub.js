import React from 'react'
import Message from '../message-types'
import DeliveryReport from '../components/delivery-report'
import MessageDate from '../components/message-date'

export default ({
  user,
  roomId,
  author,
  message,
  previousMessage
}) => (
  <div className="message-subitem">
    <MessageDate message={message} />

    <div
      className="content"
    >
      <Message
        user={user}
        roomId={roomId}
        author={author}
        message={message}
        previousMessage={previousMessage}
      />

      <DeliveryReport
        author={author}
        user={user}
        message={message}
      />
    </div>
  </div>
)
