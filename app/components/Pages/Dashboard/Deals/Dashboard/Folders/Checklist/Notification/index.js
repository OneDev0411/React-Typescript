import React from 'react'
import { useTheme } from '@material-ui/core'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { mdiCommentOutline } from '@mdi/js'

import { Tooltip } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import IconButton from 'components/Button/IconButton'

import { Container, BadgeCounter } from './styled'

function Notification(props) {
  const theme = useTheme()
  const { task, rooms } = props
  const room = rooms && rooms[task.room.id] ? rooms[task.room.id] : task.room
  const { new_notifications } = room

  return (
    <Tooltip tooltip={props.tooltip || ''} placement={props.tooltipPlacement}>
      <Container
        hasNotification={new_notifications > 0}
        style={props.style}
        onClick={() => props.onClick(task)}
      >
        <IconButton isFit iconSize="XLarge" style={{ padding: 0 }}>
          <SvgIcon
            path={mdiCommentOutline}
            color={theme.palette.divider}
            className="deal--task-comments"
          />
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
