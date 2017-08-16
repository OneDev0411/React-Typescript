import React from 'react'
import Message from '../message-types'

export default ({
  user,
  roomId,
  author,
  message,
  previousMessage
}) => (
  <div className="message-info">
    <Message
      user={user}
      roomId={roomId}
      author={author}
      message={message}
      previousMessage={previousMessage}
    />
  </div>
)
