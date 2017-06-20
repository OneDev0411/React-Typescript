import React from 'react'
import cn from 'classnames'
import Messages from '../Messages'
import Members from '../Rooms/members'
import RoomSettings from '../Rooms/settings'
import CloseIcon from '../../Partials/Svgs/CloseIcon'
import FullscreenIcon from '../../Partials/Svgs/FullscreenIcon'
import MinimizeIcon from '../../Partials/Svgs/MinimizeIcon'

const getTitle = function(title) {
  const len = 14
  if (title.length < len)
    return title
  else
    return title.substr(0, len) + '...'
}

export default ({
  room,
  settings,
  number,
  user,
  onMinimize,
  onMaximize,
  onClose,
  onChangeActive
}) => {

  if (number > 4)
    return false

  // extract settings
  const { minimize, isActive } = settings

  const width = 270 // pixels
  const defaultLeft = 90 // pixel

  let left = (width * (number - 1)) + defaultLeft

  // margin left
  if (number > 1)
    left += 20 * (number - 1)

  return (
    <div
      className={cn('chat-popup', { minimize })}
      onClick={() => onChangeActive(room.id)}
      style={{
        width: `${width}px`,
        left: `${left}px`
      }}
    >
      <div className={cn('bar', { isActive })}>
        <span
          className="room-title"
          onClick={() => onMinimize(room.id)}
        >
          { getTitle(room.proposed_title) }
        </span>

        <Members room={room} />
        <RoomSettings room={room} />

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
          className="icon close"
          onClick={() => onClose(room.id)}
        >
          <CloseIcon />
        </span>
      </div>

      <Messages
        user={user}
        roomId={room.id}
        showToolbar={false}
      />
    </div>
  )
}
