import React from 'react'
import { connect } from 'react-redux'
import { DropdownButton, MenuItem } from 'react-bootstrap'
import { mdiLogout } from '@mdi/js'
import { Box, Tooltip } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import Chatroom from '../Util/chatroom'
import MoreIcon from '../../Partials/Svgs/MoreIcon'

const RoomSettings = ({ user, room, iconSize = 17 }) => (
  <Tooltip placement="bottom" title="More Items">
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
      <MenuItem eventKey="1" onClick={() => Chatroom.leaveRoom(user.id, room)}>
        <Box display="flex" alignItems="center">
          <SvgIcon path={mdiLogout} size={muiIconSizes.small} />
          <Box ml={1}>Leave this chat</Box>
        </Box>
      </MenuItem>
    </DropdownButton>
  </Tooltip>
)

export default connect(s => ({
  user: s.data.user
}))(RoomSettings)
