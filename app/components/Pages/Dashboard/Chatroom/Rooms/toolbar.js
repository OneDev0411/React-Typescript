import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'

import { Tooltip } from '@material-ui/core'

import { toggleInstantMode } from '../../../../../store_actions/chatroom'
import Members from './members'
import RoomSettings from './settings'
import ExitFullscreenIcon from '../../Partials/Svgs/ExitFullscreenIcon'

const MessagesToolbar = ({ toggleInstantMode, instantMode, room }) => (
  <Row className="toolbar">
    <Col md={9} lg={9} sm={9} xs={9} className="title">
      {room.proposed_title}
    </Col>

    <Col md={3} lg={3} sm={3} xs={3} className="buttons">
      <Members room={room} isFullScreen />
      <RoomSettings room={room} />

      {instantMode && (
        <Tooltip placement="bottom" title="Exit Fullscreen">
          <span onClick={() => toggleInstantMode()} className="exit-fullscreen">
            <ExitFullscreenIcon />
          </span>
        </Tooltip>
      )}
    </Col>
  </Row>
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
