import React from 'react'
import moment from 'moment'

export default ({
  message
}) => (
  <div className="activity">
    { message.comment },&nbsp;
    { moment.unix(message.created_at).format('MMM DD, YY, HH:mm A')}
  </div>
)
