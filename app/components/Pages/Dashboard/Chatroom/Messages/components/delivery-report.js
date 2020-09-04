import React from 'react'
import { connect } from 'react-redux'
import { Col, OverlayTrigger, Popover, Row } from 'react-bootstrap'
import _ from 'underscore'
import moment from 'moment'
import { mdiCheck } from '@mdi/js'
import { useTheme } from '@material-ui/core/styles'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
import UserAvatar from 'components/UserAvatar'

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
          <SvgIcon path={mdiCheck} size={muiIconSizes.small} />
          <SvgIcon path={mdiCheck} size={muiIconSizes.small} />
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
                color="#000"
                fgColor="#fff"
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
  const theme = useTheme()

  if (!room || !author || author.id !== user.id) {
    return false
  }

  const ackedUsers = getAckedUsers(message, room)
  const deliveredUsers = getDeliveredUsers(message, room)
  const iconColor =
    ackedUsers.length > 0
      ? theme.palette.primary.main
      : theme.palette.grey['400']

  if (ackedUsers.length === 0 && deliveredUsers.length === 0) {
    return false
  }

  const MessageInfo = (
    <Popover
      id="popover-delivery-report"
      className="pop-over pop-over--light"
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
      <span className="delivery-report">
        <SvgIcon path={mdiCheck} size={muiIconSizes.small} color={iconColor} />
        <SvgIcon path={mdiCheck} size={muiIconSizes.small} color={iconColor} />
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
