import React from 'react'

import Message from '../message-types'
import DeliveryReport from '../components/delivery-report'
import MessageDate from '../components/message-date'

export default props => (
  <div className="message-subitem">
    <div className="content">
      <Message {...props} />

      <DeliveryReport
        author={props.author}
        user={props.user}
        message={props.message}
      />
    </div>

    <MessageDate message={props.message} />
  </div>
)
