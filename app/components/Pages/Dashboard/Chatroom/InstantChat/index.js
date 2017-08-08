import React from 'react'
import { connect } from 'react-redux'
import ChatPopups from '../Popups'
import Chatbar from '../Chatbar'
import Chatroom from '..'

const InstantChat = ({
  user,
  chatroom
}) => (
  <div>
    <Chatbar
      user={user}
      showChatbar={chatroom.showChatbar}
    />
    <ChatPopups
      user={user}
      rooms={chatroom.rooms}
    />
    <div
      className="chatroom-fullscreen"
      style={ !chatroom.instantMode ? { display: 'none' } : {} }
    >
      <Chatroom
        user={user}
        isInstant={true}
        activeRoom={chatroom.activeRoom}
      />
    </div>
  </div>
)

export default connect(({ chatroom }) => ({ chatroom }))(InstantChat)
