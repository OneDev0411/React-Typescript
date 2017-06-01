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
    const { activePopup, location } = props

    console.log('>>>>>>>>>>>>')
    let activeRoom = null

    if (location)
      activeRoom = location.hash.substr(1)

    if (activePopup)
      activeRoom = activePopup

    this.state = {
      activeRoom
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.activeRoom !== nextState.activeRoom
  }

  onChangeRoom(id) {
    this.setState({
      activeRoom: id
    })

    // don't update url hash on fullscreen mode
    if (!this.props.location)
      return false

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
