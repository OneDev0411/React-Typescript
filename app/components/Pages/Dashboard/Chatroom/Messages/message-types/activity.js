import React from 'react'
import moment from 'moment'
import Flex from 'styled-flex-component'

import IconNotification from 'components/SvgIcons/Notifications/IconNotifications'

export default ({ message }) => (
  <div className="activity">
    <Flex>
      <span
        style={{
          display: 'block',
          width: '1.8rem',
          height: '1.8rem',
          border: '1px solid #ccc',
          borderRadius: '100%',
          marginRight: '0.9rem'
        }}
      >
        <IconNotification style={{ fill: '#808080 ' }} />
      </span>
      <span className="name">{message.comment}</span>
    </Flex>

    <span>{moment.unix(message.created_at).fromNow()}</span>
  </div>
)
