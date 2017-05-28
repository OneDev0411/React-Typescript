import React from 'react'
import moment from 'moment'

export default ({
  author,
  message,
  comment
}) => {

  return (
    <div>
      <div className="title">
        { author && author.abbreviated_display_name }
      </div>

      { comment }

      <p>
        { moment.unix(message.created_at).format('Y/M/D HH:mm:ss') }
      </p>
    </div>
  )
}
