import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { toggleChatbar } from '../../../../../store_actions/chatroom'

import Badge from '../../../../../views/components/Badge'
import Tooltip from '../../../../../views/components/tooltip'
import IconButton from '../../../../../views/components/Button/IconButton'
import ChatIcon from '../../../../../views/components/SvgIcons/Chat/IconChat'

const openChatbar = toggleChatbar => {
  if (window && window.location.pathname.includes('/recents/')) {
    return false
  }

  toggleChatbar()
}

const InstantTrigger = ({ rooms, toggleChatbar }) => {
  let counter = 0

  _.each(rooms, room => {
    if (['Direct', 'Group'].indexOf(room.room_type) === -1) {
      return false
    }

    counter += room.new_notifications
  })

  return (
    <Tooltip caption="Chat" placement="right">
      <IconButton
        size="large"
        iconSize="large"
        className="c-app-sidenav__item__title--button"
        onClick={() => openChatbar(toggleChatbar)}
      >
        <ChatIcon />
        {counter > 0 && (
          <Badge
            style={{
              position: 'absolute',
              top: '4px',
              left: 'calc(100% - 12px)'
            }}
          >
            {counter > 99 ? '99+' : counter}
          </Badge>
        )}
      </IconButton>
    </Tooltip>
  )
}
export default connect(
  ({ chatroom }) => ({
    rooms: chatroom.rooms
  }),
  { toggleChatbar }
)(InstantTrigger)
