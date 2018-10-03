import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import _ from 'underscore'
import cn from 'classnames'
import moment from 'moment'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import UserAvatar from '../../../../../Partials/UserAvatar'

function getAckedUsers(message, room) {
  if (!message.acked_by) {
    return []
  }

  return _.uniq(message.acked_by)
    .map(id => ({ user: _.find(room.users, { id }) }))
    .filter(user => user !== null)
}

function getDeliveredUsers(message, room) {
  let deliveries = _.uniq(message.deliveries, d => d.user)

  if (message.acked_by) {
    deliveries = _.filter(
      deliveries,
      d => message.acked_by.indexOf(d.user) === -1
    )
  }

  return _.map(deliveries, info => ({
    user: _.find(room.users, { id: info.user }),
    info
  })).filter(user => user !== null)
}

/**
 * renders acked_by and deliveries lists
 */
const RenderList = ({ list, title, className, avatarSize = 30 }) => {
  if (list.length === 0) {
    return false
  }

  return (
    <div className={`content ${className}`}>
      <div className="title">
        <span>
          <i className="fa fa-check" />
          <i className="fa fa-check" />
        </span>
        {title}
      </div>

      <div className="report">
        {list.map(({ user, info }) => (
          <Row className="item" key={user.id}>
            <Col xs={2}>
              <UserAvatar
                style={{ float: 'left' }}
                size={avatarSize}
                color="#ffffff"
                fgColor="#000000"
                name={user.display_name}
                image={user.profile_image_url}
                showStateIndicator={false}
              />
            </Col>

            <Col xs={6} className="name-section">
              <div
                className="name"
                style={!info ? { lineHeight: `${avatarSize}px` } : {}}
              >
                {user.display_name.length <= 20
                  ? user.display_name
                  : `${user.display_name.substr(0, 20)}...`}
              </div>
              {info && (
                <div className="via">
                  Delivered via&nbsp;
                  {info.delivery_type.replace('airship', 'mobile notification')}
                </div>
              )}
            </Col>

            <Col xs={4} className="date-section">
              {info && (
                <span className="date-day">
                  {moment(info.created_at).format('ddd')}
                </span>
              )}
              {info && (
                <span className="date-time">
                  {moment(info.created_at).format('HH:mm')}
                </span>
              )}
            </Col>
          </Row>
        ))}
      </div>
    </div>
  )
}

/**
 * renders delivery notifications of a specific message
 */
const DeliveryReport = ({
  room,
  user,
  author,
  message,
  placement = 'right'
}) => {
  if (!room || !author || author.id !== user.id) {
    return false
  }

  const ackedUsers = getAckedUsers(message, room)
  const deliveredUsers = getDeliveredUsers(message, room)

  if (ackedUsers.length === 0 && deliveredUsers.length === 0) {
    return false
  }

  const MessageInfo = (
    <Popover
      id="popover-delivery-report"
      title=""
      style={{ maxWidth: '340px' }}
    >
      <RenderList list={ackedUsers} className="read-by" title="READ BY" />

      <RenderList
        list={deliveredUsers}
        className="delivered-to"
        title="DELIVERED TO"
      />
    </Popover>
  )

  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement={placement}
      overlay={MessageInfo}
    >
      <span className={cn('delivery-report', { blue: ackedUsers.length > 0 })}>
        <i className="fa fa-check" />
        <i className="fa fa-check" />
      </span>
    </OverlayTrigger>
  )
}

function mapStateToProps({ chatroom }, props) {
  return {
    room: chatroom.rooms && chatroom.rooms[props.message.room]
  }
}

export default connect(mapStateToProps)(DeliveryReport)
