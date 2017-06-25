import React from 'react'
import TextMessage from './text'
import RecommendationMessage from './recommendation'
import AlertMessage from './alert'
import Message from '../../Util/message'

export default ({
  author,
  user,
  message,
  previousMessage
}) => {

  const comment = <div
    className="inline"
    dangerouslySetInnerHTML={{ __html: Message.getText(message) }}
  />

  let message_object = comment

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

  return message_object
}
