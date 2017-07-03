import React from 'react'
import moment from 'moment'

export default ({
  message
}) => (
  <span className="date">
    { moment.unix(message.created_at).format('hh:mm A') }
  </span>
)
