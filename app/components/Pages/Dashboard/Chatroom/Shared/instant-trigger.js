import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { toggleChatbar } from '../../../../../store_actions/chatroom'
import SvgChat from '../../Partials/Svgs/Chat'

const openChatbar = (toggleChatbar) => {
  if (window && window.location.pathname.includes('/recents/'))
    return false

  toggleChatbar()
}

const InstantTrigger = ({
  rooms,
  toggleChatbar
}) => {

  let counter = 0
  _.each(rooms, room => {
    counter += room.new_notifications
  })

  return (
    <div
      className="chatroom-icon"
      onClick={() => openChatbar(toggleChatbar)}
    >
      <SvgChat color='#fff'/>
      {
        counter > 0 &&
        <span className="count">
          { counter }
        </span>
      }
    </div>
  )
}
export default connect(({chatroom}) => ({
  rooms: chatroom.rooms
}), { toggleChatbar })(InstantTrigger)
