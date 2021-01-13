import React, { useState } from 'react'
import { connect } from 'react-redux'
import { mdiLogout } from '@mdi/js'
import {
  Box,
  Tooltip,
  MenuItem,
  MenuList,
  Popover,
  makeStyles
} from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'

import Chatroom from '../Util/chatroom'
import MoreIcon from '../../Partials/Svgs/MoreIcon'

const useStyles = makeStyles(theme => ({
  paper: { marginTop: theme.spacing(1) }
}))

const RoomSettings = ({ user, room, iconSize = 17 }) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Tooltip placement="bottom" title="More Items">
        <span className="icon settings" onClick={handleClick}>
          <MoreIcon height={iconSize} />
        </span>
      </Tooltip>
      <Popover
        id="drp-room-settings"
        className="room-settings"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        classes={{ paper: classes.paper }}
      >
        <MenuList>
          <MenuItem onClick={() => Chatroom.leaveRoom(user.id, room)}>
            <Box display="flex" alignItems="center">
              <SvgIcon path={mdiLogout} size={muiIconSizes.small} />
              <Box ml={1}>Leave this chat</Box>
            </Box>
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  )
}

export default connect(s => ({
  user: s.data.user
}))(RoomSettings)
