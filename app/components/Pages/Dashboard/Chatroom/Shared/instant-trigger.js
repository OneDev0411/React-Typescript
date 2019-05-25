import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { toggleChatbar } from '../../../../../store_actions/chatroom'

import Badge from '../../../../../views/components/Badge'
import Tooltip from '../../../../../views/components/tooltip'
import ChatIcon from '../../../../../views/components/SvgIcons/Chat/IconChat'
import { SidenavIconButton } from '../../SideNav/styled'

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
      <SidenavIconButton
        inverse
        size="large"
        onClick={() => openChatbar(toggleChatbar)}
      >
        <ChatIcon style={{ width: '28px', height: '28px' }} />
        {counter > 0 && (
          <Badge
            style={{
              position: 'absolute',
              top: '6px',
              left: '50%'
            }}
          >
            {counter > 99 ? '99+' : counter}
          </Badge>
        )}
      </SidenavIconButton>
    </Tooltip>
  )
}
export default connect(
  ({ chatroom }) => ({
    rooms: chatroom.rooms
  }),
  { toggleChatbar }
)(InstantTrigger)
