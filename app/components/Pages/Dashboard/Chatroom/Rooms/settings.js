import React from 'react'
import { connect } from 'react-redux'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { leaveRoom } from '../../../../../store_actions/chatroom'

const RoomSettings = ({
  user,
  room,
  leaveRoom
}) => (
  <span>
    <DropdownButton
      id="drp-room-settings"
      className="room-settings"
      noCaret
      pullRight
      title={
        <img
          className="more"
          src="/static/images/chatroom/more.svg"
        />
      }
    >
      <MenuItem
        eventKey="1"
        onClick={() => leaveRoom(user.id, room) }
      >
        <i className="fa fa-sign-out" />
        { room.users.length <= 2 ? 'Delete this chat' : 'Leave this chat' }
      </MenuItem>

    </DropdownButton>
  </span>
)

export default connect(s => ({
  user: s.data.user
}), { leaveRoom })(RoomSettings)
