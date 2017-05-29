import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import Rooms from './Rooms'
import Messages from './Messages'
import { getRooms } from '../../../../store_actions/chatroom'

export default class Recents extends React.Component {
  static fetchData(dispatch, params) {
    const { user } = params
    return dispatch(getRooms(user))
  }

  constructor(props) {
    super(props)
    const { hash } = props.location

    this.state = {
      activeRoom: hash ? hash.substr(1) : null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.activeRoom !== nextState.activeRoom
  }

  onChangeRoom(id) {
    this.setState({
      activeRoom: id
    })

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
    const { activeRoom } = this.state
    const { user } = this.props

    return (
      <Row className="chatroom">
        <Col lg={3} md={4} sm={4} xs={5} className="no-padding">
          <Rooms
            onSelectRoom={id => this.onChangeRoom(id)}
            activeRoom={activeRoom}
          />
        </Col>

        <Col lg={9} md={8} sm={8} xs={7} className="no-padding">
          <Messages
            user={user}
            roomId={activeRoom}
          />
        </Col>
      </Row>
    )
  }
}
