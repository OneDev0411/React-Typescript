import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import ExitFullscreenIcon from '../../Partials/Svgs/ExitFullscreenIcon'
import { toggleInstanceMode } from '../../../../../store_actions/chatroom'
import Members from '../Rooms/members'
import RoomSettings from '../Rooms/settings'

const MessagesToolbar = ({
  toggleInstanceMode,
  instanceMode,
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
        instanceMode &&
        <span
          onClick={() => toggleInstanceMode()}
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
    instanceMode: chatroom.instanceMode,
    room: rooms && roomId ? rooms[roomId] : {}
  }
}

export default connect(mapStateToProps, { toggleInstanceMode })(MessagesToolbar)
