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
        <svg xmlns="http://www.w3.org/2000/svg" width="4" height="20" viewBox="0 0 4 20">
          <g fill="#B2B2B2" fillRule="evenodd">
            <circle cx="2" cy="2" r="2"/>
            <circle cx="2" cy="10" r="2"/>
            <circle cx="2" cy="18" r="2"/>
          </g>
        </svg>
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
