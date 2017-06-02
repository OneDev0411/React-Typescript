import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { slide as Menu } from 'react-burger-menu'
import Rooms from '../Rooms'
import { addChatPopup, toggleChatbar } from '../../../../../store_actions/chatroom'

const Chatbar = ({
  showChatbar,
  dispatch
}) => {

  const onSelectRoom = (roomId) => {
    dispatch(addChatPopup(roomId))
    dispatch(toggleChatbar())
  }

  return (

    <Menu
      isOpen={showChatbar}
      customBurgerIcon={false}
      customCrossIcon={false}
      onStateChange={({ isOpen }) => {
        if (showChatbar !== isOpen) {
          dispatch(toggleChatbar())
        }
      }}
    >
      <Rooms
        onSelectRoom={roomId => onSelectRoom(roomId)}
      />
    </Menu>
  )
}

export default connect(s => ({
  showChatbar: s.chatroom.showChatbar
}))(Chatbar)
