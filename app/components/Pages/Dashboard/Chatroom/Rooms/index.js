import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import _ from 'underscore'
import cn from 'classnames'
import SocketStatus from '../SocketStatus'
import CreateRoom from './create-room'
import UserAvatar from '../../../../Partials/UserAvatar'
import UserTyping from '../UserTyping'

import {
  toggleInstantMode,
  changeActiveRoom
} from '../../../../../store_actions/chatroom'

class Rooms extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      showComposeModal: false
    }
  }

  onChangeFilter(filter) {
    this.setState({ filter })
  }

  onChangeCompose(showComposeModal) {
    this.setState({ showComposeModal })
  }

  /**
   * toggle full screen chatroom
   */
  fullScreen(e) {
    e.preventDefault()
    const { activeRoom, changeActiveRoom, toggleInstantMode, showChatbar, rooms } = this.props

    // toggle chatroom display
    toggleInstantMode()

    if (showChatbar) {
      // display first room if there is no active room
      if (!activeRoom) {
        let firstRoomId = rooms[Object.keys(rooms)[0]].id
        changeActiveRoom(firstRoomId)
      }
    }
  }

  /**
   * create room's avatar image
   */
  getRoomAvatar(room) {
    const { user, activeRoom } = this.props
    const size = 35
    const color = '#d7d7d7'
    const { users } = room

    if (room.room_type === 'Group') {
      return <UserAvatar
        name={room.users.length.toString()}
        size={size}
        showStateIndicator={false}
        color={color}
      />
    }

    // get partner data
    const User = room.users.length > 1 ? _.find(room.users, u => u.id !== user.id) : room.users[0]

    return <UserAvatar
      userId={User.id}
      name={User.display_name}
      image={User.profile_image_url}
      size={size}
      color={color}
      borderColor={room.id === activeRoom ? '#2196f3' : '#303E4D' }
    />
  }

  /**
   * get room title, trim long titles
   */
  getRoomTitle(title) {
    const len = 20
    if (title.length <= len)
      return title

    return title.substr(0, len) + '...'
  }

  render() {
    const { filter, showComposeModal } = this.state
    const { showChatbar, instantMode, rooms, activeRoom } = this.props

    return (
      <div className="rooms">
        <div className="toolbar">
          <div
            className="search"
            style={{ float: showChatbar ? 'left': 'none' }}
          >
            <input
              className="form-control filter"
              type="text"
              placeholder="Search"
              onChange={e => this.onChangeFilter(e.target.value)}
              value={filter}
            />
          </div>

          <div
            className="toggle-sidebar"
            style={{ display: showChatbar ? 'block': 'none' }}
          >
            <a
              href="/dashboard/recents"
              onClick={e => this.fullScreen(e)}
              className="btn-tgl"
            >
              {
                instantMode ?
                <i className="fa fa-angle-double-left fa-2x"></i> :
                <i className="fa fa-angle-double-right fa-2x"></i>
              }
            </a>
          </div>

          <SocketStatus />
        </div>

        <div className="list-container">
          <div className="list">
            {
              _.chain(rooms)
              .filter(room =>
                room.proposed_title && room
                  .proposed_title
                  .toLowerCase()
                  .startsWith(filter.toLowerCase())
              )
              .sortBy(room => room.updated_at * -1)
              .map(room =>
                <Row
                  onClick={() => this.props.onSelectRoom(room.id)}
                  key={`ROOM_CHANNEL_${room.id}`}
                  className={cn('item', { active: room.id === activeRoom })}
                >
                  <Col sm={1} xs={1} className="avatar vcenter">
                    { this.getRoomAvatar(room) }
                  </Col>
                  <Col
                    sm={8}
                    xs={8}
                    className={cn('title vcenter', { hasNotification: room.new_notifications > 0 })}
                  >
                    <span>
                      { this.getRoomTitle(room.proposed_title) }
                    </span>
                    <UserTyping roomId={room.id} />
                  </Col>

                  <Col sm={2} xs={2} className="notifications vcenter">
                    {
                      room.new_notifications > 0 &&
                      <span className="count">
                        { room.new_notifications }
                      </span>
                    }
                  </Col>
                </Row>
              )
              .value()
            }
          </div>
        </div>

        <CreateRoom />
      </div>
    )
  }
}

function mapStateToProps({ chatroom }) {
  return {
    instantMode: chatroom.instantMode,
    showChatbar: chatroom.showChatbar,
    rooms: chatroom.rooms
  }
}

export default connect(
  mapStateToProps,
  ({ toggleInstantMode, changeActiveRoom })
)(Rooms)
