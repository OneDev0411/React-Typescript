import React from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { slide as Menu } from 'react-burger-menu'
import Rooms from '../Rooms'
import { toggleChatbar } from '../../../../../store_actions/chatroom'

const Chatbar = ({
  show,
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
    console.log(roomId)
  }

  return (
    <Menu
      isOpen={show}
      onStateChange={({ isOpen }) => {
        if (show !== isOpen) {
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
  show: s.chatroom.showChatbar,
  location: s.data.location
}))(Chatbar)
