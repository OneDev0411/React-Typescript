import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import Flex from 'styled-flex-component'

import { toggleChatbar } from '../../../../../store_actions/chatroom'

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
    <Flex alignCenter>
      <Tooltip caption="Chat" placement="right">
        <IconButton
          size="large"
          iconSize="large"
          className="c-app-sidenav__item__title--button"
          onClick={() => openChatbar(toggleChatbar)}
        >
          <ChatIcon />
        </IconButton>
      </Tooltip>
      {counter > 0 && (
        <span className="c-app-sidenav__notification-badge">{counter}</span>
      )}
    </Flex>
  )
}
export default connect(
  ({ chatroom }) => ({
    rooms: chatroom.rooms
  }),
  { toggleChatbar }
)(InstantTrigger)
