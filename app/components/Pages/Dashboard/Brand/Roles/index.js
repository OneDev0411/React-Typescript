import React from 'react'
import { connect } from 'react-redux'
import { getMessages } from '../../../../../store_actions/chatroom'
import Header from './Header'

class Messages extends React.Component {
  render() {
    return (
      <div className="roles">
        <Header />
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  messages: chatroom.messages
}), ({ getMessages }))(Messages)
