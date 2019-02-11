import React from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'

import Tooltip from 'components/tooltip'
import IconComment from 'components/SvgIcons/DealComment/IconComment'

import IconButton from 'components/Button/IconButton'

import { Container, BadgeCounter } from './styled'

function Notification(props) {
  const { task, rooms } = props
  const room = rooms && rooms[task.room.id] ? rooms[task.room.id] : task.room
  const { new_notifications } = room

  return (
    <Tooltip caption={props.tooltip} placement={props.tooltipPlacement}>
      <Container
        hasNotification={new_notifications > 0}
        style={props.style}
        onClick={() => props.onClick(task)}
      >
        <IconButton isFit iconSize="XLarge" style={{ padding: 0 }}>
          <IconComment className="deal--task-comments" />
        </IconButton>

        {new_notifications > 0 && (
          <BadgeCounter>{new_notifications}</BadgeCounter>
        )}
      </Container>
    </Tooltip>
  )
}

Notification.propTypes = {
  task: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  tooltipPlacement: PropTypes.string,
  style: PropTypes.object
}

Notification.defaultProps = {
  onClick: () => null,
  tooltip: null,
  tooltipPlacement: 'top',
  style: {}
}

export default connect(({ chatroom }) => ({
  rooms: chatroom.rooms
}))(Notification)
