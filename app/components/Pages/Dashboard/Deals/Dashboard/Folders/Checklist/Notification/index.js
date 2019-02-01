import React from 'react'
import { connect } from 'react-redux'

import Tooltip from 'components/tooltip'
import IconComment from 'components/SvgIcons/Comment/IconComment'

import IconButton from 'components/Button/IconButton'

import { Container, BadgeCounter } from './styled'

function Notification(props) {
  const { task, rooms } = props
  const room = rooms && rooms[task.room.id] ? rooms[task.room.id] : task.room
  const { new_notifications } = room

  return (
    <Tooltip
      caption={props.tooltip}
      placement={props.tooltipPlacement || 'top'}
    >
      <Container hasNotification={new_notifications > 0} style={props.style}>
        <IconButton
          isFit
          iconSize="large"
          style={{ padding: 0 }}
          onClick={() => props.onClick(task)}
        >
          <IconComment className="deal--task-comments" />
        </IconButton>

        {new_notifications > 0 && (
          <BadgeCounter>{new_notifications}</BadgeCounter>
        )}
      </Container>
    </Tooltip>
  )
}

export default connect(({ chatroom }) => ({
  rooms: chatroom.rooms
}))(Notification)
