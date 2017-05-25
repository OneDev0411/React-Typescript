import React from 'react'
import { connect } from 'react-redux'

const MessagesToolbar = ({
  rooms,
  roomId
}) => {

  if (!roomId)
    return false

  // get room info
  const room = rooms[roomId]

  return (
    <div className="toolbar">
      { room.proposed_title }
    </div>
  )
}

export default connect(s => ({
  rooms: s.chatroom.rooms
}))(MessagesToolbar)
