import React from 'react'
import emojify from 'emojify.js'
import linkifyString from 'linkifyjs/string'
import { Row, Col } from 'react-bootstrap'
import TextMessage from './text'
import RecommendationMessage from './recommendation'
import AlertMessage from './alert'
import UserAvatar from '../../../../../Partials/UserAvatar'
import DeliveryReport from '../delivery-report'

emojify.setConfig({
  img_dir: '/static/images/emoji'
})

/**
 * get message's author
 */
const getAuthor = (message) => {
  if (!message)
    return null

  if (message.author)
    return message.author

  const alert = isAlert(message)
  if (alert)
    return alert.created_by

  // test for listing without message
  if (message.notification &&
    message.notification.subjects &&
    message.notification.subjects[0].type === 'user'
  ) {
    return message.notification.subjects[0]
  }

  return null
}

/**
 * check message is alert
 */
const isAlert = (message) => {
  if (message.notification &&
    message.notification.object_class === 'Alert' &&
    message.notification.objects
  ) {
    return message.notification.objects[0]
  }

  return false
}

/**
 * get message text
 */
const getMessageText = (message) => {
  let text = message.comment

  if (message.comment) {
    text = emojify.replace(linkifyString(message.comment))
  }

  return text
}

export default ({
  user,
  message,
  previousMessage
}) => {

  // get user author
  const author = getAuthor(message)
  const previousAuthor = getAuthor(previousMessage)

  // check message is alert
  const alert = isAlert(message)

  // const comment
  const comment = <div
    dangerouslySetInnerHTML={{ __html: getMessageText(message) }}
  />

  let message_object = comment

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

  let avatar
  if (!previousMessage || message.recommendation || alert || previousAuthor.id !== author.id) {
    avatar = (
      <UserAvatar
        userId={author.id}
        name={author.display_name}
        image={author.profile_image_url}
        size={35}
      />
    )
  }

  return (
    <div className="message-item">
      <div className="avatar">
        { avatar }
      </div>

      <div className="content">
        <div>
          <span className="title">{ author && author.abbreviated_display_name }</span>
        </div>

        { message_object }
      </div>
    </div>
  )
}
