import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import PopupWindow from './window'
import NotificationService from '../../../../../services/notification'
import * as actionCreators from '../../../../../store_actions/chatroom/popups'

const onToggleMinimize = (roomId, settings, minimizeChatPopup) => {
  minimizeChatPopup(roomId)

  if (settings.minimize === true) {
    NotificationService.clear(roomId)
  }
}

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
            onMinimize={roomId => onToggleMinimize(roomId, settings, minimizeChatPopup)}
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
