import React from 'react'
import Messages from '../Messages'

export default ({
  roomId,
  number,
  user
}) => {

  if (number > 4)
    return false

  const width = 20 // percent
  const defaultLeft = 7 // percent

  let left = (width * (number - 1)) + defaultLeft

  // margin left
  if (number > 1)
    left += 1 * (number - 1)

  return (
    <div
      className="chat-popup"
      style={{
        width: `${width}%`,
        left: `${left}%`
      }}
    >
      <div className="content">
        <Messages
          user={user}
          roomId={roomId}
          showToolbar={false}
        />
      </div>
    </div>
  )
}
