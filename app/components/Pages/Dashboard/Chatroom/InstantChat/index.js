import React from 'react'
import { connect } from 'react-redux'
import ChatPopups from '../Popups'
import Chatbar from '../Chatbar'
import Chatroom from '..'

const InstantChat = ({
  user,
  rooms,
  fullscreen,
  activeRoom,
  showChatbar
}) => (
  <div>
    <Chatbar
      user={user}
      showChatbar={showChatbar}
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
        isInstance={true}
        activeRoom={activeRoom}
      />
    </div>
  </div>
)

export default connect(({ chatroom }) => ({
  showChatbar: chatroom.showChatbar,
  rooms: chatroom.rooms,
  activeRoom: chatroom.activeRoom,
  fullscreen: chatroom.fullscreen
}))(InstantChat)
