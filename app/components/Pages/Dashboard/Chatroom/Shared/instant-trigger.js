import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'
import { toggleChatbar } from '../../../../../store_actions/chatroom'
import SvgChat from '../../Partials/Svgs/Chat'

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
      onClick={toggleChatbar}
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
