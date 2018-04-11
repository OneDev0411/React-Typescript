import React from 'react'
import moment from 'moment'

export default ({ message }) => (
  <span className="date">
    {moment.unix(message.created_at).format('MMM DD, YY, h:mm A')}
  </span>
)
