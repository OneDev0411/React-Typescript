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
      className="c-app-navbar__item__inbox"
      onClick={() => openChatbar(toggleChatbar)}
    >
      <span className="c-app-navbar__item__inbox__icon">
        <SvgChat color="#8da2b5" />
        {counter > 0 && (
          <span className="c-app-navbar__notification-badge">{counter}</span>
        )}
      </span>
      <span className="c-app-navbar__item__title">Inbox</span>
    </div>
  )
}
export default connect(
  ({ chatroom }) => ({
    rooms: chatroom.rooms
  }),
  { toggleChatbar }
)(InstantTrigger)
