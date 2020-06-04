import React from 'react'
import cn from 'classnames'

import ClickOutside from 'react-click-outside'

import Messages from '../Messages'
import Toolbar from './toolbar'
import ChatNotification from '../../../../../services/notification/chat'

import { appSidenavWidth } from '../../SideNav/variables'

/**
 * on focus popup
 */
const onFocus = (e, room, onChangeActive) => {
  onChangeActive(room.id)
  resetNotifications(room)
}

/**
 * reset room's notifications
 */
const resetNotifications = room => {
  if (~~room.new_notifications > 0) {
    ChatNotification.clear(room.id)
  }
}

export default ({
  room,
  settings,
  number,
  user,
  isActive,
  onMinimize,
  onMaximize,
  onClose,
  onChangeActive,
  instantMode
}) => {
  // extract settings
  const { minimize } = settings
  const width = 270 // pixels
  const defaultLeft = appSidenavWidth + 8 // pixel

  let left = width * (number - 1) + defaultLeft

  // limit popups count based on screen width
  if (left + defaultLeft + width > window.innerWidth) {
    return false
  }

  // margin left
  if (number > 1) {
    left += 20 * (number - 1)
  }

  if (!room.id) {
    return null
  }

  return (
    <ClickOutside
      onClickOutside={() => {
        if (isActive && !instantMode) {
          onChangeActive(null)
        }
      }}
    >
      <div
        className={cn('chat-popup', { minimize })}
        id={`CHAT_POPUP_${room.id}`}
        style={{
          width: `${width}px`,
          left: `${left}px`
        }}
      >
        <Toolbar
          room={room}
          isActive={isActive}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
        />
        <Messages
          user={user}
          roomId={room.id}
          showToolbar={false}
          baseHeight="297px"
          isPopup
          onClick={e => onFocus(e, room, onChangeActive)}
        />
      </div>
    </ClickOutside>
  )
}
