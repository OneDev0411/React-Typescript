import React from 'react'
import cn from 'classnames'
import Members from '../Rooms/members'
import CloseIcon from '../../Partials/Svgs/CloseIcon'
import FullscreenIcon from '../../Partials/Svgs/FullscreenIcon'
import MinimizeIcon from '../../Partials/Svgs/MinimizeIcon'

const getTitle = (title) => {
  const len = 13
  if (title.length < len) { return title }
  return `${title.substr(0, len)}...`
}

export default ({
  room,
  isActive,
  onMinimize,
  onMaximize,
  onClose
}) => (
  <div
    className={cn('bar', {
      blinking: room.new_notifications > 0,
      isActive
    })}
  >
    <span
      className="room-title"
      onClick={() => onMinimize(room.id)}
    >
      { getTitle(room.proposed_title) }
    </span>

    <div className="icons">

      <span
        className="icon minimize minimize-icon"
        onClick={() => onMinimize(room.id)}
      >
        <MinimizeIcon />
      </span>

      <span
        className="icon maximize maximize-icon"
        onClick={() => onMaximize(room.id)}
      >
        <FullscreenIcon />
      </span>

      <Members
        room={room}
        iconSize={12}
      />

      <span
        className="icon times close-icon"
        onClick={() => onClose(room.id)}
      >
        <CloseIcon />
      </span>
    </div>
  </div>
)
