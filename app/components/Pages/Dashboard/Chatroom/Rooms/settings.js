import React from 'react'
import { connect } from 'react-redux'
import { DropdownButton, MenuItem, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Chatroom from '../Util/chatroom'
import MoreIcon from '../../Partials/Svgs/MoreIcon'

const RoomSettings = ({
  user,
  room,
  iconSize = 17
}) => (

  <OverlayTrigger
    placement="bottom"
    overlay={<Tooltip id="popover-leave">More Items</Tooltip>}
  >
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
        onClick={() => Chatroom.leaveRoom(user.id, room)}
      >
        <i className="fa fa-sign-out" />
        Leave this chat
      </MenuItem>

    </DropdownButton>
  </OverlayTrigger>
)

export default connect(s => ({
  user: s.data.user
}))(RoomSettings)
