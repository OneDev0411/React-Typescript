import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import ChatPopups from '../Popups'
import Chatbar from '../Chatbar'
import Chatroom from '../index'

const InstantChat = ({ user, chatroom }) => (
  <Fragment>
    <Chatbar user={user} showChatbar={chatroom.showChatbar} />
    <ChatPopups
      user={user}
      rooms={chatroom.rooms}
      instantMode={chatroom.instantMode}
    />
    <Chatroom user={user} isInstant />
  </Fragment>
)

export default connect(({ chatroom }) => ({ chatroom }))(InstantChat)
