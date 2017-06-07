import React from 'react'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-bootstrap'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import Rooms from './Rooms'
import Messages from './Messages'
import { getRooms, changeActiveRoom } from '../../../../store_actions/chatroom'
import store from '../../../../stores'

class Chatroom extends React.Component {
  static fetchData(dispatch, params) {
    const { user } = params
    return dispatch(getRooms(user))
  }

  componentWillMount() {
    const { activeRoom, params } = this.props
    const { rooms } = store.getState().chatroom

    if (params && params.roomId)
      return this.changeRoom(params.roomId)

    if (!activeRoom && _.size(rooms) > 0)
      return this.changeRoom(rooms[_.keys(rooms)[0]].id)
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { activeRoom } = this.props
    return nextProps.activeRoom !== undefined && activeRoom !== nextProps.activeRoom
  }

  changeRoom(id) {
    const { changeActiveRoom, activeRoom, location } = this.props

    if (id !== activeRoom)
      changeActiveRoom(id)

    // don't change url on fullscreen mode
    if (this.props.location)
      browserHistory.push(`/dashboard/recents/${id}`)
  }

  render() {
    const { user, activeRoom } = this.props

    if (!activeRoom)
      return false

    return (
      <Row className="chatroom">
        <Col lg={3} md={3} sm={4} xs={5} className="no-padding">
          <Rooms
            user={user}
            onSelectRoom={id => this.changeRoom(id)}
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

export default connect(({ chatroom }) => ({
  activeRoom: chatroom.activeRoom
}), ({ changeActiveRoom }))(Chatroom)
