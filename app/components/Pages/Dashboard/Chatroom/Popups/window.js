import React from 'react'
import cn from 'classnames'
import Messages from '../Messages'

const getTitle = function(title) {
  const len = 15
  if (title.length < len)
    return title
  else
    return title.substr(0, 15) + ' ...'
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

  const width = 270 // percent
  const defaultLeft = 90 // percent

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
          <b>{ getTitle(room.proposed_title) }</b>
        </span>

        <i
          className="fa icon fa-window-minimize"
          onClick={() => onMinimize(room.id)}
        ></i>

        <i
          className="fa icon fa-window-maximize"
          onClick={() => onMaximize(room.id)}
        ></i>

        <i
          className="fa icon fa-times"
          onClick={() => onClose(room.id)}
        ></i>
      </div>
      <Messages
        user={user}
        roomId={room.id}
        showToolbar={false}
      />
    </div>
  )
}
