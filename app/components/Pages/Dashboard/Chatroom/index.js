import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import Rooms from './Rooms'
import Messages from './Messages'
import { getRooms, changeActiveRoom } from '../../../../store_actions/chatroom'

class Chatroom extends React.Component {
  static fetchData(dispatch, params) {
    const { user } = params
    return dispatch(getRooms(user))
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { activeRoom } = this.props
    return nextProps.activeRoom !== undefined && activeRoom !== nextProps.activeRoom
  }

  onChangeRoom(id) {
    const { dispatch, activeRoom, location } = this.props

    if (id !== activeRoom)
      dispatch(changeActiveRoom(id))

    // don't update url hash on fullscreen mode
    if (this.props.location)
      this.updateHash(id)
  }

  updateHash(roomId) {
    if (history.pushState) {
      history.pushState(null, null, `#${roomId}`)
    }
    else {
      location.hash = `#${roomId}`
    }
  }

  render() {
    const { user, activeRoom } = this.props

    return (
      <Row className="chatroom">
        <Col lg={3} md={3} sm={4} xs={5} className="no-padding">
          <Rooms
            onSelectRoom={id => this.onChangeRoom(id)}
            activeRoom={activeRoom}
          />
        </Col>

        <Col lg={9} md={9} sm={8} xs={7} className="no-padding">
          <Messages
            user={user}
            roomId={activeRoom}
            showToolbar={true}
          />
        </Col>
      </Row>
    )
  }
}

export default connect(s => ({
  activeRoom: s.chatroom.activeRoom
}))(Chatroom)
