import React from 'react'
import messageUtil from '../Util/message'
import LeadMessage from './message-kinds/lead'
import SubMessage from './message-kinds/sub'
import SingleMessage from './message-kinds/single'

export default ({
  user,
  roomId,
  message,
  previousMessage
}) => {

  // get message author
  const author = messageUtil.getAuthor(message)

  // check message is alert
  const isAlert = messageUtil.isAlert(message)

  // check message is activity
  const isActivity = message.activity !== null

  // check message has attachment
  const hasAttachments = message.attachments && message.attachments.length > 0

  // create props object
  const props = { user, roomId, author, message, previousMessage }

  /*
   * check message is a a single/info message or not
   */
  if (isActivity) {
    return <SingleMessage {...props} />
  }

  /*
   * check message is a lead message or not
   * lead message has avatar and date
   * sub message comes without avatar (grouping concept)
   */
  const isLeadMessage = previousMessage === null ||
    message.recommendation ||
    isAlert ||
    hasAttachments ||
    message.uploading ||
    messageUtil.getAuthor(previousMessage).id !== author.id ||
    messageUtil.getYMD(previousMessage) !== messageUtil.getYMD(message)

  return isLeadMessage ? <LeadMessage {...props} /> : <SubMessage {...props} />
}
