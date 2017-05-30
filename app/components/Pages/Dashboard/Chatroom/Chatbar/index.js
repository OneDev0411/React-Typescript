import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { slide as Menu } from 'react-burger-menu'
import Rooms from '../Rooms'
import { toggleChatbar, addChatPopup } from '../../../../../store_actions/chatroom'

const Chatbar = ({
  showChatbar,
  dispatch,
  location
}) => {

  const onFullScreen = () => {
    dispatch(toggleChatbar())
    const url = '/dashboard/recents'
    if (location.pathname !== url)
      browserHistory.push(url)
  }

  const onSelectRoom = (roomId) => {
    dispatch(toggleChatbar())
    dispatch(addChatPopup(roomId))
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
        isSidebar={true}
        onFullScreen={() => onFullScreen()}
        onSelectRoom={roomId => onSelectRoom(roomId)}
      />
    </Menu>
  )
}

export default connect(s => ({
  showChatbar: s.chatroom.showChatbar,
  location: s.data.location
}))(Chatbar)
