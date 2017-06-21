import React from 'react'
import cn from 'classnames'
import Members from '../Rooms/members'
import RoomSettings from '../Rooms/settings'
import CloseIcon from '../../Partials/Svgs/CloseIcon'
import FullscreenIcon from '../../Partials/Svgs/FullscreenIcon'
import MinimizeIcon from '../../Partials/Svgs/MinimizeIcon'

const getTitle = function(title) {
  const len = 13
  if (title.length < len)
    return title
  else
    return title.substr(0, len) + '...'
}

export default ({
  room,
  isActive,
  onMinimize,
  onMaximize,
  onClose,
}) => (
  <div className={cn('bar', { isActive })}>
    <span
      className="room-title"
      onClick={() => onMinimize(room.id)}
    >
      { getTitle(room.proposed_title) }
    </span>

    <div className="icons">
      <Members
        room={room}
        iconSize={14}
      />

      <RoomSettings
        room={room}
        iconSize={14}
      />

      <span
        className="icon minimize"
        onClick={() => onMinimize(room.id)}>
        <MinimizeIcon />
      </span>

      <span
        className="icon maximize"
        onClick={() => onMaximize(room.id)}
      >
        <FullscreenIcon />
      </span>

      <span
        className="icon times"
        onClick={() => onClose(room.id)}
      >
        <CloseIcon />
      </span>
    </div>
  </div>
)
