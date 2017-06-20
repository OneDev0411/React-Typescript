import React from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" >
            <g fill="#B2B2B2" fill-rule="evenodd">
              <path d="M1.707 19.707L7 14.414V17h2v-6H3v2h2.586L.293 18.293zM17 7h-2.586l5.293-5.293L18.293.293 13 5.586V3h-2v6h6z"/>
            </g>
          </svg>
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
