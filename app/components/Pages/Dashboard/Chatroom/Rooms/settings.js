import React from 'react'
import { connect } from 'react-redux'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { leaveRoom } from '../../../../../store_actions/chatroom'
import MoreIcon from '../../Partials/Svgs/MoreIcon'

const RoomSettings = ({
  user,
  room,
  leaveRoom,
  iconSize = 17
}) => (
  <span>
    <DropdownButton
      id="drp-room-settings"
      className="room-settings"
      noCaret
      pullRight
      title={
        <span className="icon settings">
          <MoreIcon height={iconSize} />
        </span>
      }
    >
      <MenuItem
        eventKey="1"
        onClick={() => leaveRoom(user.id, room) }
      >
        <i className="fa fa-sign-out" />
        Leave this chat
      </MenuItem>

    </DropdownButton>
  </span>
)

export default connect(s => ({
  user: s.data.user
}), { leaveRoom })(RoomSettings)
