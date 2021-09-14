import React from 'react'

import { slide as Menu } from 'react-burger-menu'
import { connect } from 'react-redux'

import { toggleChatbar } from '../../../../../store_actions/chatroom'
import Rooms from '../Rooms'
import Chatroom from '../Util/chatroom'

const Chatbar = ({
  user,
  showChatbar,
  /* mapped actions to dispatch */
  toggleChatbar
}) => (
  <Menu
    isOpen={showChatbar}
    customBurgerIcon={false}
    customCrossIcon={false}
    width="330px"
    onStateChange={({ isOpen }) => {
      if (showChatbar !== isOpen) {
        toggleChatbar()
      }
    }}
  >
    <Rooms
      user={user}
      onSelectRoom={roomId => {
        // open chat
        Chatroom.openChat(roomId)
        // close chatbar
        toggleChatbar()
      }}
    />
  </Menu>
)

export default connect(
  ({ chatroom }) => ({
    showChatbar: chatroom.showChatbar
  }),
  { toggleChatbar }
)(Chatbar)
