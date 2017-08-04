import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'
import Rooms from './Rooms'
import Messages from './Messages'
import ChatNotification from './Services/notification'
import { getRooms, changeActiveRoom } from '../../../../store_actions/chatroom'
import store from '../../../../stores'

// set rooms container width
const roomsWidth = '330px'

class Chatroom extends React.Component {
  static fetchData(dispatch, params) {
    const { user } = params
    return dispatch(getRooms(user))
  }

  componentWillMount() {
    const { activeRoom, params } = this.props
    const { rooms } = store.getState().chatroom

    if (!(params && params.roomId) && !activeRoom && _.size(rooms) > 0)
      return this.changeRoom(rooms[_.keys(rooms)[0]].id)
  }

  shouldComponentUpdate(nextProps) {
    const { activeRoom, location, isInstant, instantMode } = this.props

    // when user switch from popup to full screen (= instant) chat
    if (isInstant && instantMode !== nextProps.instantMode) {
      return nextProps.activeRoom !== undefined &&
        nextProps.instantMode === true
    }

    // when user works in full screen mode
    if (isInstant && instantMode === nextProps.instantMode) {
      return nextProps.activeRoom !== undefined &&
        nextProps.instantMode === true &&
        activeRoom !== nextProps.activeRoom
    }

    // when user works in router mode
    return nextProps.activeRoom !== undefined &&
      nextProps.location !== undefined &&
      activeRoom !== nextProps.activeRoom &&
      (nextProps.location.query.redirect !== undefined || location.key !== nextProps.location.key)
  }

  componentWillReceiveProps(nextProps) {
    const { activeRoom, params, rooms } = nextProps
    if (params && params.roomId && params.roomId !== activeRoom && _.size(rooms) > 0)
      return this.changeRoom(params.roomId)
  }
  changeRoom(id) {
    const { instantMode, changeActiveRoom, activeRoom } = this.props

    if (id !== activeRoom) {
      changeActiveRoom(id)

      // ack rooms notifications
      ChatNotification.clear(id)
    }

    // don't change url on instant mode
    if (!instantMode) {
      browserHistory.push(`/dashboard/recents/${id}`)
    }
  }

  getLeft() {
    const { instantMode } = this.props
    return instantMode ? roomsWidth : `calc(65px + ${roomsWidth})`
  }

  render() {
    const { user, activeRoom, isInstant } = this.props

    return (
      <div className="chatroom">
        <audio id="chatroom-new-message">
          <soruce src="/static/audio/ding.wav" type="audio/wav" />
          <source src="/static/audio/ding.mp3" type="audio/mpeg" />
        </audio>

        <div
          className="col-md-1 no-padding"
          style={{ width: roomsWidth }}
        >
          <Rooms
            user={user}
            onSelectRoom={id => this.changeRoom(id)}
            activeRoom={activeRoom}
          />
        </div>

        <div
          className="messages-container no-padding"
          style={{
            position: 'absolute',
            width: `calc(100vw - ${this.getLeft()})`,
            left: this.getLeft(),
            right: 0
          }}
        >
          <Messages
            user={user}
            roomId={activeRoom}
            showToolbar
            isInstantChat={isInstant}
          />
        </div>
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  instantMode: chatroom.instantMode,
  activeRoom: chatroom.activeRoom,
  rooms: chatroom.rooms
}), ({ changeActiveRoom }))(Chatroom)
