import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import PopupWindow from './window'
import * as actionCreators from '../../../../../store_actions/chatroom/popups'

const ChatPopups = ({
  user,
  rooms,
  popups,
  activeRoom,
  /* mapped props to dispatch */
  minimizeChatPopup,
  closeChatPopup,
  maximizeChatPopup,
  changeActivePopup
}) => {

  if (!popups)
    return false

  // counter for popups
  let counter = 1

  return (
    <div>
      {
        _.map(popups, (settings, roomId) => {
          return <PopupWindow
            key={`CHAT_POPUP_${roomId}`}
            number={counter++}
            user={user}
            settings={settings}
            isActive={activeRoom === roomId}
            room={rooms[roomId]}
            onMinimize={roomId => minimizeChatPopup(roomId)}
            onMaximize={roomId => maximizeChatPopup(roomId)}
            onClose={roomId => closeChatPopup(roomId)}
            onChangeActive={roomId => changeActivePopup(roomId)}
          />
        })
      }
    </div>
  )
}

export default connect(({ chatroom }) => ({
  activeRoom: chatroom.activeRoom,
  popups: chatroom.popups,
}), actionCreators)(ChatPopups)
