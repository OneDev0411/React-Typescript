import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import _ from 'underscore'
import cn from 'classnames'
import AddMember from './add-member'
import UserAvatar from '../../../../Partials/UserAvatar'

import {
  toggleInstanceMode,
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

  shouldComponentUpdate(nextProps, nextState) {
    const { showChatbar, instanceMode } = nextProps

    if (nextProps.handler === 'Instance' && !instanceMode)
      return false

    if (nextProps.handler === 'Chatbar' && !showChatbar)
      return false

    return true
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
    const { activeRoom, changeActiveRoom, toggleInstanceMode, showChatbar, rooms } = this.props

    // toggle chatroom display
    toggleInstanceMode()

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
    const size = 30
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
    const len = 30
    if (title.length <= len)
      return title

    return title.substr(0, len) + '...'
  }

  render() {
    const { filter, showComposeModal } = this.state
    const { showChatbar, instanceMode, rooms, activeRoom } = this.props

    return (
      <div className="rooms">
        <div className="toolbar">
          <div className="search">
            <input
              className="form-control filter"
              type="text"
              placeholder="Search"
              onChange={e => this.onChangeFilter(e.target.value)}
              value={filter}
            />
          </div>

          {
            showChatbar &&
            <div className="toggle-sidebar">
              <a
                href="/dashboard/recents"
                onClick={e => this.fullScreen(e)}
                className="btn-tgl"
              >
                {
                  instanceMode ?
                  <i className="fa fa-angle-double-left fa-2x"></i> :
                  <i className="fa fa-angle-double-right fa-2x"></i>
                }
              </a>
            </div>
          }

        </div>

        <div className="list-container">
          <div className="list">
            {
              _.chain(rooms)
              .filter(room => room.proposed_title.toLowerCase().startsWith(filter.toLowerCase()))
              .sortBy(room => room.updated_at * -1)
              .map(room =>
                <Row
                  onClick={() => this.props.onSelectRoom(room.id)}
                  key={`ROOM_CHANNEL_${room.id}`}
                  className={cn('item', { active: room.id === activeRoom })}
                >
                  <Col sm={1} xs={1} className="avatar">
                    { this.getRoomAvatar(room) }
                  </Col>
                  <Col sm={8} xs={8} className="title">
                    { this.getRoomTitle(room.proposed_title) }
                  </Col>

                  <Col sm={2} xs={2} className="notifications">
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

        <AddMember />
      </div>
    )
  }
}

function mapStateToProps({ chatroom }) {
  return {
    instanceMode: chatroom.instanceMode,
    showChatbar: chatroom.showChatbar,
    rooms: chatroom.rooms
  }
}

export default connect(
  mapStateToProps,
  ({ toggleInstanceMode, changeActiveRoom })
)(Rooms)
