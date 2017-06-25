import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import _ from 'underscore'
import moment from 'moment'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import UserAvatar from '../../../../../Partials/UserAvatar'

function renderAckedUsers(message, room) {
  if (!message.acked_by)
    return false

  const list = _
    .uniq(message.acked_by)
    .map(id => ({ user: _.find(room.users, { id }) }))
    .filter(user => user !== null)

  if (list.length === 0)
    return false

  return <RenderList
    list={list}
    className="read-by"
    title="READ BY"
  />
}

function renderDeliveredUsers(message, room) {

  let deliveries = _.uniq(message.deliveries, d => d.user)

  if (message.acked_by)
    deliveries = _.filter(deliveries, d => message.acked_by.indexOf(d.user) === -1)

  const list = _
    .map(deliveries, info => {
      return {
        user: _.find(room.users, { id: info.user }),
        info
      }
    })
    .filter(user => user !== null)

  if (list.length === 0)
    return false

  return <RenderList
    list={list}
    className="delivered-to"
    title="DELIVERED TO"
  />
}

/**
 * renders acked_by and deliveries lists
 */
const RenderList = ({
  list,
  title,
  className,
  avatarSize = 30
}) => (
  <div className={`content ${className}`}>
    <div className="title">
      <span>
        <i className="fa fa-check" />
        <i className="fa fa-check" />
      </span>
      { title }
    </div>

    <div className="report">
      {
        list.map(({ user, info }) =>
          <Row
            className="item"
            key={user.id}
          >
            <Col xs={2}>
              <UserAvatar
                style={{ float: 'left' }}
                size={avatarSize}
                name={user.display_name}
                image={user.profile_image_url}
                showStateIndicator={false}
              />
            </Col>

            <Col xs={6} className="name-section">
              <div
                className="name"
                style={ !info ? {lineHeight: `${avatarSize}px`} : {} }
              >
                {
                  user.display_name.length <= 14 ?
                  user.display_name :
                  user.display_name.substr(0, 14) + '...'
                }
              </div>
              {
                info &&
                <div className="via">
                  Delivered via { info.delivery_type }
                </div>
              }
            </Col>

            <Col xs={4} className="date-section">
              {
                info &&
                <span className="date-day">
                  { moment(info.created_at).format('ddd') }
                </span>
              }
              {
                info &&
                <span className="date-time">
                  { moment(info.created_at).format('HH:mm') }
                </span>
              }
            </Col>

          </Row>
        )
      }
    </div>
  </div>
)

/**
 * renders delivery notifications of a specific message
 */
const DeliveryReport = ({
  room,
  user,
  author,
  message
}) => {

  if (!author || author.id !== user.id)
    return false

  const MessageInfo = (
    <Popover
      id="popover-delivery-report"
      title="Delivery Status"
      style={{ width: '400px' }}
    >
      { renderAckedUsers(message, room) }
      { renderDeliveredUsers(message, room) }
    </Popover>
  )
  return (
    <OverlayTrigger
      trigger="click"
      rootClose
      placement="right"
      overlay={MessageInfo}
    >
      <span className="delivery-report">
        <i className="fa fa-check" />
        <i className="fa fa-check" />
      </span>
    </OverlayTrigger>
  )
}

function mapStateToProps(state, ownProps) {
  return {
    room: state.chatroom.rooms[ownProps.message.room]
  }
}

export default connect(mapStateToProps)(DeliveryReport)
