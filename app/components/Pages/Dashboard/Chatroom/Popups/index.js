import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import PopupWindow from './window'
import {
  minimizeChatPopup,
  closeChatPopup,
  maximizeChatPopup,
  changeActivePopup
} from '../../../../../store_actions/chatroom'
import store from '../../../../../stores'

/*
 * minimize a chat popup
 */
const minimize = function(roomId) {
  store.dispatch(minimizeChatPopup(roomId))
}


/*
 * maximize a chat popup
 */
const maximize = function(roomId) {
  store.dispatch(maximizeChatPopup(roomId))
}
/*
 * remove a chat popup
 */
const close = function(roomId) {
  store.dispatch(closeChatPopup(roomId))
  changeActive(roomId)
}

/**
 * change active popup window
 */
const changeActive = function(roomId) {
  store.dispatch(changeActivePopup(roomId))
}

const ChatPopups = ({
  user,
  rooms,
  popups
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
            user={user}
            settings={settings}
            room={rooms[roomId]}
            number={counter++}
            onMinimize={roomId => minimize(roomId)}
            onMaximize={roomId => maximize(roomId)}
            onClose={roomId => close(roomId)}
            onChangeActive={roomId => changeActive(roomId)}
          />
        })
      }
    </div>
  )
}

export default connect(s => ({
  popups: s.chatroom.popups,
}))(ChatPopups)
