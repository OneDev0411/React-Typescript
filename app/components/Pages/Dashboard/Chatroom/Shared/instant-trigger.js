import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { toggleChatbar } from '../../../../../store_actions/chatroom'
import SvgChat from '../../Partials/Svgs/Chat'

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
    <div
      data-balloon="Chat Rooms"
      data-balloon-pos="right"
      className="chatroom-icon"
      onClick={() => openChatbar(toggleChatbar)}
    >
      <SvgChat color="#4e5c6c" />
      {counter > 0 && <span className="count">{counter}</span>}
    </div>
  )
}
export default connect(
  ({ chatroom }) => ({
    rooms: chatroom.rooms
  }),
  { toggleChatbar }
)(InstantTrigger)
