import React from 'react'
import moment from 'moment'

export default ({ message }) => (
  <div className="activity">
    <span className="name">{message.comment}</span>
    <span>
      {moment.unix(message.created_at).format('MMM DD, YYYY, h:mm A')}
    </span>
  </div>
)
