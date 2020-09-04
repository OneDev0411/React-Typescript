import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import _ from 'underscore'

import cn from 'classnames'

import Rooms from './Rooms'
import Messages from './Messages'
import ChatNotification from '../../../../services/notification/chat'
import {
  changeActiveRoom,
  toggleInstantMode
} from '../../../../store_actions/chatroom'
import store from '../../../../stores'

// set rooms container width
const roomsWidth = '330px'

class Chatroom extends React.Component {
  UNSAFE_componentWillMount() {
    const { activeRoom, params, instantMode } = this.props
    const { rooms } = store.getState().chatroom

    // select room if is requested in url
    if (params && params.roomId) {
      !instantMode && this.props.toggleInstantMode()

      return this.changeRoom(params.roomId)
    }

    // if there is no active room, select first room by default
    if (params && !activeRoom && _.size(rooms) > 0) {
      return this.changeRoom(rooms[_.keys(rooms)[0]].id)
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isInstant, instantMode } = this.props

    if (
      !isInstant &&
      !nextProps.instantMode &&
      instantMode !== nextProps.instantMode &&
      nextProps.location
    ) {
      browserHistory.push('/dashboard/mls')
    }
  }

  shouldComponentUpdate(nextProps) {
    const { activeRoom, location, isInstant, instantMode } = this.props

    // when user switch from popup to full screen (= instant) chat
    if (isInstant && instantMode !== nextProps.instantMode) {
      return nextProps.activeRoom !== undefined
    }

    // when user works in full screen mode
    if (isInstant && instantMode === nextProps.instantMode) {
      return (
        nextProps.activeRoom !== undefined &&
        nextProps.instantMode === true &&
        activeRoom !== nextProps.activeRoom
      )
    }

    // when user works in router mode
    return (
      nextProps.activeRoom !== undefined &&
      nextProps.location !== undefined &&
      activeRoom !== nextProps.activeRoom &&
      (nextProps.location.query.redirect !== undefined ||
        location.key !== nextProps.location.key)
    )
  }

  changeRoom(id) {
    const { instantMode, changeActiveRoom, activeRoom, location } = this.props

    if (id !== activeRoom) {
      changeActiveRoom(id)

      // ack rooms notifications
      ChatNotification.clear(id)
    }

    // don't change url on instant mode
    if (location && !instantMode) {
      browserHistory.push(`/dashboard/recents/${id}`)
    }
  }

  getLeft() {
    const { instantMode } = this.props

    return instantMode ? roomsWidth : `calc(65px + ${roomsWidth})`
  }

  render() {
    const { user, activeRoom, isInstant, instantMode } = this.props

    return (
      <div
        className={cn('chatroom-fullscreen', {
          hide: !instantMode
        })}
      >
        <div className="chatroom">
          <audio id="chatroom-new-message">
            <source src="/static/audio/ding.mp3" type="audio/mpeg" />
          </audio>

          <div className="col-md-1 no-padding" style={{ width: roomsWidth }}>
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
      </div>
    )
  }
}

export default connect(
  ({ chatroom }) => ({
    instantMode: chatroom.instantMode,
    activeRoom: chatroom.activeRoom
  }),
  { changeActiveRoom, toggleInstantMode }
)(Chatroom)
