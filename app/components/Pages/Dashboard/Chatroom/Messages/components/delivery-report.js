import React, { useState } from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import moment from 'moment'
import { mdiCheck } from '@mdi/js'
import { useTheme } from '@material-ui/core/styles'
import { Grid, Popover, Box } from '@material-ui/core'

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
          <Grid container className="item" key={user.id} alignItems="center">
            <Grid item xs={2}>
              <UserAvatar
                style={{ float: 'left' }}
                size={avatarSize}
                color="#000"
                fgColor="#fff"
                name={user.display_name}
                image={user.profile_image_url}
                showStateIndicator={false}
              />
            </Grid>

            <Grid item xs={6} className="name-section">
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
            </Grid>

            <Grid item xs={4} className="date-section">
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
            </Grid>
          </Grid>
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
  const [anchorEl, setAnchorEl] = useState(null)

  if (!room || !author || author.id !== user.id) {
    return false
  }

  const ackedUsers = getAckedUsers(message, room)
  const deliveredUsers = getDeliveredUsers(message, room)
  const iconColor =
    ackedUsers.length > 0
      ? theme.palette.primary.main
      : theme.palette.grey['400']

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'popover-delivery-report' : undefined

  if (ackedUsers.length === 0 && deliveredUsers.length === 0) {
    return false
  }

  return (
    <>
      <span className="delivery-report" onClick={handleClick}>
        <SvgIcon path={mdiCheck} size={muiIconSizes.small} color={iconColor} />
        <SvgIcon path={mdiCheck} size={muiIconSizes.small} color={iconColor} />
      </span>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        placement={placement}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left'
        }}
      >
        <Box width={340}>
          <RenderList list={ackedUsers} className="read-by" title="READ BY" />
          <RenderList
            list={deliveredUsers}
            className="delivered-to"
            title="DELIVERED TO"
          />
        </Box>
      </Popover>
    </>
  )
}

function mapStateToProps({ chatroom }, props) {
  return {
    room: chatroom.rooms && chatroom.rooms[props.message.room]
  }
}

export default connect(mapStateToProps)(DeliveryReport)
