import React from 'react'
import { connect } from 'react-redux'

import IconComment from 'components/SvgIcons/Comment/IconComment'
import { Container, BadgeCounter } from './styled'

function Notification(props) {
  const { task, rooms } = props
  const room = rooms && rooms[task.room.id] ? rooms[task.room.id] : task.room
  const { new_notifications } = room

  if (!new_notifications || new_notifications === 0) {
    return false
  }

  return (
    <Container>
      <IconComment />
      <BadgeCounter>{new_notifications}</BadgeCounter>
    </Container>
  )
}

export default connect(({ chatroom }) => ({
  rooms: chatroom.rooms
}))(Notification)
