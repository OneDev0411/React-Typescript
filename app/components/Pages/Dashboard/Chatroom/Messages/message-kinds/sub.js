import React from 'react'
import Message from '../message-types'
import DeliveryReport from '../components/delivery-report'
import MessageDate from '../components/message-date'

export default props => (
  <div className="message-subitem">
    <MessageDate message={props.message} />

    <div className="content">
      <Message {...props} />

      <DeliveryReport
        author={props.author}
        user={props.user}
        message={props.message}
      />
    </div>
  </div>
)
