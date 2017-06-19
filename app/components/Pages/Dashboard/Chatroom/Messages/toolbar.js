import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { toggleInstanceMode } from '../../../../../store_actions/chatroom'
import Members from '../Rooms/members'

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

      {
        instanceMode &&
        <img
          className="close-instance"
          src="/static/images/chatroom/exit-fullscreen.svg"
          onClick={() => toggleInstanceMode()}
        />
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
