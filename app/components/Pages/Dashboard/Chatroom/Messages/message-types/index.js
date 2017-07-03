import React from 'react'
import TextMessage from './text'
import RecommendationMessage from './recommendation'
import AlertMessage from './alert'
import AttachementMessage from './attachment'
import Message from '../../Util/message'

export default ({
  author,
  user,
  roomId,
  message,
  previousMessage
}) => {

  const comment = Message.getText(message)

  // simple comment
  let message_object = <div
    className="comment inline"
    dangerouslySetInnerHTML={{ __html: comment }}
  />

  // check message is alert
  const alert = Message.isAlert(message)
  if (alert) {
    message_object = <AlertMessage
      alert={alert}
    />
  }

  if (message.recommendation) {
    message_object = <RecommendationMessage
      author={author}
      user={user}
      recommendation={message.recommendation}
      message={message}
      comment={comment}
    />
  }

  // check message has attachment
  const hasAttachments = message.attachments && message.attachments.length > 0
  if (hasAttachments) {
    message_object = <AttachementMessage
      comment={comment}
      attachments={message.attachments}
    />
  }

  return message_object
}
