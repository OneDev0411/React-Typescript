import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { compose,  withState, lifecycle, pure } from 'recompose'
import _ from 'underscore'
import cn from 'classnames'
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
              <div
                onClick={() => onSelectRoom(room.id)}
                key={`ROOM_CHANNEL_${room.id}`}
                className={cn('item', { active: room.id === activeRoom })}
              >
                { room.proposed_title }
              </div>
            )
            .value()
          }
        </div>
      </div>
    </div>
  )
}

export default enhance(Rooms)
