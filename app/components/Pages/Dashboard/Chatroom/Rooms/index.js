import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Row, Col } from 'react-bootstrap'
import { compose,  withState, lifecycle, pure } from 'recompose'
import _ from 'underscore'
import cn from 'classnames'
import UserAvatar from '../../../../Partials/UserAvatar'
import {
  toggleFullScreen,
  changeActiveRoom,
  toggleChatbar
} from '../../../../../store_actions/chatroom'


const enhance = compose(
  pure,
  withState('filter', 'changeFilter', ''),
  connect(
    ({ chatroom }) => ({
      isFullscreen: chatroom.fullscreen,
      showChatbar: chatroom.showChatbar,
      rooms: chatroom.rooms
    }),
    ({ toggleFullScreen, changeActiveRoom, toggleChatbar })
  )
)

const Rooms = ({
  user,
  isFullscreen,
  showChatbar,
  rooms,
  activeRoom,
  onSelectRoom,
  changeFilter,
  filter,
  /* mapped actions to dispatch */
  toggleFullScreen,
  changeActiveRoom,
  toggleChatbar
}) => {

  /**
   * toggle full screen chatroom
   */
  const fullScreen = function(e) {
    e.preventDefault()

    // toggle chatroom display
    toggleFullScreen()

    if (showChatbar) {
      // display first room if there is no active room
      if (!activeRoom) {
        let firstRoomId = rooms[Object.keys(rooms)[0]].id
        changeActiveRoom(firstRoomId)
      }

      // toggle chatbar
      toggleChatbar()
    }
  }

  /**
   * create room's avatar image
   */
  const getRoomAvatar = function(room) {
    const size = 30
    const color = '#263445'
    const { users } = room

    if (room.room_type === 'Group') {
      return <UserAvatar
        name={room.users.length.toString()}
        size={size}
        showStateIndicator={false}
        color={color}
      />
    }

    const User = room.users.length > 1 ? _.find(room.users, u => u.id !== user.id) : room.users[0]

    return <UserAvatar
      userId={User.id}
      name={User.display_name}
      image={User.profile_image_url}
      size={size}
      color={color}
      borderColor={room.id === activeRoom ? '#008000' : '#303E4D' }
    />
  }

  // console.log(rooms)
  return (
    <div className="rooms">
      <div className="toolbar">

        <a
          href="/dashboard/recents"
          onClick={e => fullScreen(e)}
        >
          { isFullscreen ? ' [ <<<< ] ' : ' [ >>>> ] ' }
        </a>

        <input
          className="form-control filter"
          type="text"
          placeholder="filter list ..."
          onChange={e => changeFilter(e.target.value)}
          value={filter}
        />
      </div>

      <div className="list-container">
        <div className="section-title">
        </div>
        <div className="list">
          {
            _.chain(rooms)
            .filter(room => room.proposed_title.toLowerCase().startsWith(filter.toLowerCase()))
            .map(room =>
              <Row
                onClick={() => onSelectRoom(room.id)}
                key={`ROOM_CHANNEL_${room.id}`}
                className={cn('item', { active: room.id === activeRoom })}
              >
                <Col xs={2} className="avatar">
                  { getRoomAvatar(room) }
                </Col>
                <Col xs={9} className="title">
                  { room.proposed_title }
                </Col>
              </Row>
            )
            .value()
          }
        </div>
      </div>
    </div>
  )
}

export default enhance(Rooms)
