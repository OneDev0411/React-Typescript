import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { toggleInstantMode } from '../../../../../store_actions/chatroom'
import Members from './members'
import RoomSettings from './settings'
import ExitFullscreenIcon from '../../Partials/Svgs/ExitFullscreenIcon'

const MessagesToolbar = ({
  toggleInstantMode,
  instantMode,
  room
}) => (
  <Row className="toolbar">
    <Col md={9} lg={9} sm={9} xs={9}>
      { room.proposed_title }
    </Col>

    <Col md={3} lg={3} sm={3} xs={3} className="buttons">
      <Members room={room} />
      <RoomSettings room={room} />

      {
        instantMode &&
        <span
          onClick={() => toggleInstantMode()}
          className="exit-fullscreen"
        >
          <ExitFullscreenIcon />
        </span>
      }
    </Col>
  </Row>
)

function mapStateToProps({ chatroom }, ownProps) {
  const { roomId } = ownProps
  const { rooms } = chatroom

  return {
    instantMode: chatroom.instantMode,
    room: rooms && roomId ? rooms[roomId] : {}
  }
}

export default connect(mapStateToProps, { toggleInstantMode })(MessagesToolbar)
