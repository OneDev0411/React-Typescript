import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { slide as Menu } from 'react-burger-menu'
import Chatroom from '..'
import Rooms from '../Rooms'
import {
  toggleChatbar,
  addChatPopup
} from '../../../../../store_actions/chatroom'

const Chatbar = ({
  user,
  fullscreen,
  showChatbar,
  activePopup,
  dispatch,
  location
}) => {

  const onSelectRoom = (roomId) => {
    dispatch(toggleChatbar())
    dispatch(addChatPopup(roomId))
  }

  return (
    <div>
      <div
        className="chatroom-fullscreen"
        style={{ display: fullscreen ? 'block' : 'none' }}
      >
        <Chatroom
          user={user}
          activePopup={activePopup}
        />
      </div>

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
    </div>
  )
}

export default connect(s => ({
  activePopup: s.chatroom.activePopup,
  fullscreen: s.chatroom.fullscreen,
  showChatbar: s.chatroom.showChatbar,
  location: s.data.location
}))(Chatbar)
