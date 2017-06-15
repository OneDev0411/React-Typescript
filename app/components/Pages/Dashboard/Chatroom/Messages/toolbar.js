import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { toggleInstanceMode } from '../../../../../store_actions/chatroom'

const MessagesToolbar = ({
  toggleInstanceMode,
  instanceMode,
  room
}) => (
  <Row className="toolbar">
    <Col md={11} lg={11} sm={11} xs={11}>
      { room.proposed_title }
    </Col>

    <Col md={1} lg={1} sm={1} xs={1}>
      {
        instanceMode &&
        <i
          className="close-instance fa fa-window-close"
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
