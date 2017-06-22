import React from 'react'
import moment from 'moment'

export default ({
  author,
  message,
  comment
}) => {

  return (
    <div>

      { comment }

      <p>
        { moment.unix(message.created_at).format('Y/M/D HH:mm:ss') }
      </p>
    </div>
  )
}
