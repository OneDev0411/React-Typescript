import React from 'react'
import DateSplitter from '../components/date-splitter'
import UserAvatar from '../../../../../Partials/UserAvatar'
import Message from '../message-types'
import DeliveryReport from '../components/delivery-report'
import MessageDate from '../components/message-date'

export default ({
  user,
  author,
  message,
  previousMessage
}) => (
  <div className="message-group">
    <DateSplitter
      message={message}
      previousMessage={previousMessage}
    />

    <div className="message-item">
      <div className="avatar">
        <UserAvatar
          userId={author.id}
          name={author.display_name}
          image={author.profile_image_url}
          size={35}
        />
      </div>

      <div className="content">
        <div>
          <span className="title">
            { author && author.abbreviated_display_name }
          </span>

          <MessageDate message={message} />

          <DeliveryReport
            author={author}
            user={user}
            message={message}
          />
        </div>

        <Message
          user={user}
          author={author}
          message={message}
          previousMessage={previousMessage}
        />
      </div>
    </div>
  </div>
)
