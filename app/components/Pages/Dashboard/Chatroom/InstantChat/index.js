import React, { Fragment } from 'react'

import { connect } from 'react-redux'

import Chatroom from '..'
import Chatbar from '../Chatbar'
import ChatPopups from '../Popups'

const InstantChat = ({ user, chatroom }) => (
  <Fragment>
    <Chatbar user={user} />
    <ChatPopups
      user={user}
      rooms={chatroom.rooms}
      instantMode={chatroom.instantMode}
    />
    <Chatroom user={user} isInstant />
  </Fragment>
)

export default connect(({ chatroom }) => ({ chatroom }))(InstantChat)
