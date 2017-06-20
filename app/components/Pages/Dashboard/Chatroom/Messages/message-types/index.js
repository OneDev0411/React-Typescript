import React from 'react'
import emojify from 'emojify.js'
import linkifyString from 'linkifyjs/string'
import { Row, Col } from 'react-bootstrap'
import TextMessage from './text'
import RecommendationMessage from './recommendation'
import AlertMessage from './alert'
import UserAvatar from '../../../../../Partials/UserAvatar'

emojify.setConfig({
  img_dir: '/static/images/emoji'
})

/**
 * get message's author
 */
const getAuthor = (message) => {
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

  // if (!message_image && message.comment) {
  //   text = emojify.replace(linkifyString(message.comment))
  //   text = makeMentionBlue(text)
  // }
  if (message.comment) {
    text = emojify.replace(linkifyString(message.comment))
    text = makeMentionBlue(text)
  }

  return text
}

/**
 *
 */
const makeMentionBlue = (text) => {
  // TODO (needs to refactor Tony's codes)

  // const data = this.props.data
  // const current_room = data.current_room
  // const users = current_room.users
  // let filterd_text = text
  // users.forEach((user) => {
  //   const full_name = `${user.first_name} ${user.last_name}`
  //   if (text.trim().indexOf(full_name.trim()) !== -1)
  //     filterd_text = text.replace(new RegExp(full_name, 'g'), `<span class="text-primary">${user.first_name}</span>`)
  // })
  // return filterd_text
  return text
}

export default ({
  user,
  message
}) => {

  // get user author
  const author = getAuthor(message)

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

  return (
    <div className="message-item">
      <div className="avatar">
        <UserAvatar
          userId={author.id}
          name={author.display_name}
          image={author.profile_image_url}
          size={35}
        />
      </div>

      <div className="content">
        <div className="title">
          { author && author.abbreviated_display_name }
        </div>
        { message_object }
      </div>
    </div>
  )
}
