import React from 'react'
import { connect } from 'react-redux'
import RecommendationMessage from './recommendation'
import AlertMessage from './alert'
import AttachementMessage from './attachment'
import ActivityMessage from './activity'
import UploadingFile from './uploading'
import Message from '../../Util/message'

const MessageTypes = ({
  author,
  user,
  members,
  message,
  openFilesInNewTab
}) => {
  const comment = Message.getText(message, members, user)

  // simple comment
  let message_object = (
    <div
      className="comment inline"
      dangerouslySetInnerHTML={{ __html: comment }}
    />
  )

  // check message is alert
  const alert = Message.isAlert(message)

  if (alert) {
    message_object = <AlertMessage alert={alert} />
  }

  if (message.recommendation) {
    message_object = (
      <RecommendationMessage
        author={author}
        user={user}
        recommendation={message.recommendation}
        message={message}
        comment={comment}
      />
    )
  }

  // check message has attachment
  const hasAttachments = message.attachments && message.attachments.length > 0

  if (hasAttachments) {
    message_object = (
      <AttachementMessage
        comment={comment}
        attachments={message.attachments}
        openFilesInNewTab={openFilesInNewTab}
      />
    )
  }

  // check message is ActivityMessage
  if (message.activity) {
    message_object = <ActivityMessage message={message} />
  }

  // check message is uploading a file
  if (message.uploading) {
    message_object = (
      <UploadingFile author={author} user={user} message={message} />
    )
  }

  return message_object
}

function mapStateToProps({ chatroom }, props) {
  const room = chatroom.rooms && chatroom.rooms[props.roomId]

  return {
    members: room ? room.users : null
  }
}

export default connect(mapStateToProps)(MessageTypes)
