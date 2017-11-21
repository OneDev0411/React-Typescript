import React from 'react'
import messageUtil from '../../Util/message'

export default ({
  previousMessage,
  message
}) => {
  const messageDate = messageUtil.getYMD(message)
  const previousMessageDate = messageUtil.getYMD(previousMessage)

  // dont show date-splitter when loading previous messages or when
  // messages are in the same day
  if (previousMessage === null || previousMessageDate === messageDate) { return false }

  return (
    <div className="date-splitter">
      <span>
        { messageUtil.getDate(message, 'dddd, MMM DD, YYYY')}
      </span>
    </div>
  )
}
