import React from 'react'

import UserAvatar from 'components/UserAvatar'
import MiniContact from 'components/MiniContact'

import DateSplitter from '../components/date-splitter'
import Message from '../message-types'
import DeliveryReport from '../components/delivery-report'
import MessageDate from '../components/message-date'

export default props => {
  const {
    user,
    author,
    message,
    previousMessage,
    deliveryReportPlacement
  } = props

  const shouldShowMiniContact = props.author.type === 'user'
  const ContentWrapper = shouldShowMiniContact ? MiniContact : React.Fragment
  const contentProps = shouldShowMiniContact
    ? { type: 'user', data: author }
    : {}

  return (
    <div className="message-group">
      <DateSplitter message={message} previousMessage={previousMessage} />

      <div className="message-item">
        <div className="avatar">
          <UserAvatar
            userId={author.id}
            name={author.display_name}
            image={author.profile_image_url}
            size={28}
            color="#000000"
          />
        </div>

        <ContentWrapper {...contentProps}>
          <div className="content">
            <div>
              <span className="title">
                {author && author.abbreviated_display_name}
              </span>

              <MessageDate message={message} />

              <DeliveryReport
                author={author}
                user={user}
                message={message}
                placement={deliveryReportPlacement}
              />
            </div>
          </div>
        </ContentWrapper>

        <Message {...props} />
      </div>
    </div>
  )
}
