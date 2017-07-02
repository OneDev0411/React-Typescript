import React from 'react'
import messageUtil from '../Util/message'
import LeadMessage from './message-kinds/lead'
import SubMessage from './message-kinds/sub'

export default ({
  user,
  message,
  previousMessage
}) => {

  // get message author
  const author = messageUtil.getAuthor(message)

  // check message is alert
  const isAlert = messageUtil.isAlert(alert)

  // check message has attachment
  const hasAttachments = message.attachments && message.attachments.length > 0

  /*
   * check message is a lead message or not
   * lead message has avatar and date
   * sub message comes without avatar (grouping concept)
   */
  const isLeadMessage = previousMessage === null ||
    message.recommendation ||
    isAlert ||
    hasAttachments ||
    messageUtil.getAuthor(previousMessage).id !== author.id ||
    messageUtil.getYMD(previousMessage) !== messageUtil.getYMD(message)

  const props = { user, author, message, previousMessage }
  return isLeadMessage ? <LeadMessage {...props} /> : <SubMessage {...props} />
}
