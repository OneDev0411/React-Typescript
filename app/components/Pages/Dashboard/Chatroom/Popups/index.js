import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import PopupWindow from './window'

const ChatPopups = ({
  user,
  popups
}) => {
  if (!popups)
    return false

  // counter for popups
  let counter = 1

  return (
    <div>
      {
        _.map(popups, (popup, roomId) => {
          return <PopupWindow
            key={`CHAT_POPUP_${roomId}`}
            user={user}
            roomId={roomId}
            number={counter++}
          />
        })
      }
    </div>
  )
}

export default connect(s => ({
  popups: s.chatroom.popups,
}))(ChatPopups)
