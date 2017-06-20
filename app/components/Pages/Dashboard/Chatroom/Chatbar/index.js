import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { slide as Menu } from 'react-burger-menu'
import Rooms from '../Rooms'
import Socket from '../../../../../services/socket'
import { addChatPopup, toggleChatbar } from '../../../../../store_actions/chatroom'

const Chatbar = ({
  user,
  showChatbar,
  /* mapped actions to dispatch */
  addChatPopup,
  toggleChatbar
}) => {

  return (
    <Menu
      isOpen={showChatbar}
      customBurgerIcon={false}
      customCrossIcon={false}
      width={"330px"}
      onStateChange={({ isOpen }) => {
        if (showChatbar !== isOpen) {
          toggleChatbar()
        }
      }}
    >
      <Rooms
        user={user}
        onSelectRoom={roomId => {
          Socket.clearNotifications(roomId)
          addChatPopup(roomId)
          toggleChatbar()
        }}
      />
    </Menu>
  )
}

export default connect(({ chatroom }) => ({
  showChatbar: chatroom.showChatbar
}), ({ addChatPopup, toggleChatbar }))(Chatbar)
