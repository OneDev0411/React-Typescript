import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { batchActions } from 'redux-batched-actions'
import _ from 'underscore'

import PopupWindow from './window'
import ChatNotification from '../../../../../services/notification/chat'

import * as popupActionCreators from '../../../../../store_actions/chatroom/popups'
import {
  changeActiveRoom,
  toggleInstantMode
} from '../../../../../store_actions/chatroom'

/**
 * when user clicks on minimize icon
 */
const onToggleMinimize = (props, roomId, settings) => {
  const { activeRoom, minimizeChatPopup, changeActiveRoom } = props
  const { minimize } = settings

  // find new active room
  let newActiveRoom = activeRoom

  // closing a popup
  if (minimize === false && roomId === activeRoom) {
    newActiveRoom = null
  }

  // opening popup
  if (minimize === true) {
    ChatNotification.clear(roomId)
    newActiveRoom = roomId
  }

  batchActions([minimizeChatPopup(roomId), changeActiveRoom(newActiveRoom)])
}

/**
 * when user clicks on maximize icon
 */
const onMaximize = (props, roomId) => {
  const { maximizeChatPopup, changeActiveRoom, toggleInstantMode } = props

  batchActions([
    changeActiveRoom(roomId),
    toggleInstantMode(),
    maximizeChatPopup(roomId)
  ])
}

/**
 * when user clicks on maximize icon
 */
const onClose = (props, roomId) => {
  const { activeRoom, popups, closeChatPopup, changeActiveRoom } = props

  let newActiveRoom = activeRoom === roomId ? null : activeRoom

  /**
   * when user closes a popup:
   * if the room was active and there are more that one popups then
   * make first popup active
   */
  if (newActiveRoom === null && _.size(popups) >= 2) {
    const rooms = Object.keys(popups).filter(room => room !== roomId)

    newActiveRoom = rooms[0]
  }

  batchActions([changeActiveRoom(newActiveRoom), closeChatPopup(roomId)])
}

const ChatPopups = props => {
  const {
    user,
    rooms,
    popups,
    activeRoom,
    /* mapped props to dispatch */
    changeActiveRoom
  } = props

  if (!popups) {
    return false
  }

  // counter for popups
  let counter = 1

  return (
    <div>
      {_.map(popups, (settings, roomId) => (
        <PopupWindow
          key={`CHAT_POPUP_${roomId}`}
          number={counter++}
          user={user}
          settings={settings}
          instantMode={props.instantMode}
          isActive={activeRoom === roomId}
          room={rooms[roomId]}
          onMinimize={roomId => onToggleMinimize(props, roomId, settings)}
          onMaximize={roomId => onMaximize(props, roomId)}
          onClose={roomId => onClose(props, roomId)}
          onChangeActive={roomId => changeActiveRoom(roomId)}
        />
      ))}
    </div>
  )
}

function mapStateToProps({ chatroom }) {
  return {
    activeRoom: chatroom.activeRoom,
    popups: chatroom.popups
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      ...popupActionCreators,
      ...{ changeActiveRoom },
      ...{ toggleInstantMode }
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatPopups)
