import React from 'react'
import { connect } from 'react-redux'
import ChatPopups from '../Popups'
import Chatbar from '../Chatbar'
import Chatroom from '..'

const InstantChat = ({
  user,
  rooms,
  fullscreen,
  activePopup
}) => (
  <div>
    <Chatbar
      user={user}
    />
    <ChatPopups
      user={user}
      rooms={rooms}
    />
    <div
      className="chatroom-fullscreen"
      style={{ display: fullscreen ? 'block' : 'none' }}
    >
      <Chatroom
        user={user}
        activePopup={activePopup}
      />
    </div>

  </div>
)

export default connect(s => ({
  activePopup: s.chatroom.activePopup,
  fullscreen: s.chatroom.fullscreen
}))(InstantChat)
