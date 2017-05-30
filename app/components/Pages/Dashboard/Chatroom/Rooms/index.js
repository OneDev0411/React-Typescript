import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { compose,  withState, lifecycle, pure } from 'recompose'
import _ from 'underscore'
import cn from 'classnames'

const enhance = compose(
  pure,
  withState('filter', 'changeFilter', ''),
  lifecycle({
    componentDidMount() {
      const { rooms, activeRoom, onSelectRoom, isSidebar } = this.props

      if (
        isSidebar !== true &&
        !activeRoom &&
        rooms &&
        onSelectRoom
      ) {
        const room = _.find(rooms, r => r.room_type === 'Direct')
        onSelectRoom(room.id)
      }
    }
  })
)

const Rooms = ({
  isSidebar,
  rooms,
  activeRoom,
  onSelectRoom,
  changeFilter,
  filter,
  onFullScreen
}) => {

  const fullScreen = function(e) {
    e.preventDefault()
    onFullScreen()
  }

  return (
    <div className="rooms">
      <div className="toolbar">
        {
          isSidebar &&
          <a
            href="/dashboard/recents"
            onClick={e => fullScreen(e)}
          >
            Full screen
          </a>
        }

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

export default connect(s => ({
  rooms: s.chatroom.rooms
}))(enhance(Rooms))
