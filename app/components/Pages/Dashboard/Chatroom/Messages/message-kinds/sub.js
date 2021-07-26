import React from 'react'

import DeliveryReport from '../components/delivery-report'
import MessageDate from '../components/message-date'
import Message from '../message-types'

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
