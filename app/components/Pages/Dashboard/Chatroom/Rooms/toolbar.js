import React from 'react'
import { connect } from 'react-redux'

import { Tooltip, Grid } from '@material-ui/core'

import { toggleInstantMode } from '../../../../../store_actions/chatroom'
import Members from './members'
import RoomSettings from './settings'
import ExitFullscreenIcon from '../../Partials/Svgs/ExitFullscreenIcon'

const MessagesToolbar = ({ toggleInstantMode, instantMode, room }) => (
  <Grid container className="toolbar">
    <Grid item md={9} lg={9} sm={9} xs={9} className="title">
      {room.proposed_title}
    </Grid>

    <Grid item md={3} lg={3} sm={3} xs={3} className="buttons">
      <Members room={room} isFullScreen />
      <RoomSettings room={room} />

      {instantMode && (
        <Tooltip placement="bottom" title="Exit Fullscreen">
          <span onClick={() => toggleInstantMode()} className="exit-fullscreen">
            <ExitFullscreenIcon />
          </span>
        </Tooltip>
      )}
    </Grid>
  </Grid>
)

function mapStateToProps({ chatroom }, ownProps) {
  const { roomId } = ownProps
  const { rooms } = chatroom

  return {
    instantMode: chatroom.instantMode,
    room: (rooms && rooms[roomId]) || {}
  }
}

export default connect(mapStateToProps, { toggleInstantMode })(MessagesToolbar)
