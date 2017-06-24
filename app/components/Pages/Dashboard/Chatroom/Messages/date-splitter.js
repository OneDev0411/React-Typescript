import React from 'react'
import moment from 'moment'

export default ({
  previousMessageDate,
  messageDate,
  message
}) => {

  // dont show date-splitter when loading previous messages or when
  // messages are in the same day
  if (previousMessageDate === null || previousMessageDate === messageDate)
    return false

  return (
    <div className="date-splitter">
      <span>
        { moment.unix(message.created_at).format('dddd, MMMM YYYY') }
      </span>
    </div>
  )
}
