import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { toggleChatbar } from '../../../../../store_actions/chatroom'
import SvgChat from '../../Partials/Svgs/Chat'
import { toggleBrand } from '../../../../../store_actions/brandConsole/index'

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
    <div>
      <button
        className="c-app-sidenav__item__title--button"
        onClick={() => openChatbar(toggleChatbar)}
      >
        Inbox
        {counter > 0 && (
          <span className="c-app-sidenav__notification-badge">{counter}</span>
        )}
      </button>
    </div>
  )
}
export default connect(
  ({ chatroom }) => ({
    rooms: chatroom.rooms
  }),
  { toggleChatbar }
)(InstantTrigger)
