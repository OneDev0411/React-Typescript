import React from 'react'
import messageUtil from '../Util/message'
import LeadMessage from './message-kinds/lead'
import SubMessage from './message-kinds/sub'
import SingleMessage from './message-kinds/single'

export default ({
  user,
  roomId,
  message,
  previousMessage,
  openFilesInNewTab,
  deliveryReportPlacement
}) => {
  // get message author
  const author = messageUtil.getAuthor(message)

  // author of previous message
  const previousMessageAuthor = messageUtil.getAuthor(previousMessage) || {}

  // check message is alert
  const isAlert = messageUtil.isAlert(message)

  // check message has attachment
  const hasAttachments = message.attachments && message.attachments.length > 0

  // create props object
  const sharedProps = {
    user,
    roomId,
    author,
    message,
    previousMessage,
    openFilesInNewTab,
    deliveryReportPlacement
  }

  /*
   * check message is a a single/info message or not
   */
  if (message.activity) {
    return <SingleMessage {...sharedProps} />
  }

  /*
   * check message is a lead message or not
   * lead message has avatar and date
   * sub message comes without avatar (grouping concept)
   */
  const isLeadMessage =
    previousMessage === null ||
    previousMessage.activity ||
    message.recommendation ||
    isAlert ||
    hasAttachments ||
    message.uploading ||
    previousMessageAuthor.id !== author.id ||
    messageUtil.getYMD(previousMessage) !== messageUtil.getYMD(message)

  return isLeadMessage ? (
    <LeadMessage {...sharedProps} />
  ) : (
    <SubMessage {...sharedProps} />
  )
}
