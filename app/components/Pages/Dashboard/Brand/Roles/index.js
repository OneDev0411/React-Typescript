import React from 'react'
import { connect } from 'react-redux'
import { getMessages } from '../../../../../store_actions/chatroom'
import Header from './Header'
import Column from './Column'

class Messages extends React.Component {
  componentDidMount() {

  }

  render() {
    const roles = [
      {
        title: 'test1',
        users: [
          { name: 'user1' }
        ]
      },
      {
        title: 'test2',
        users: [
          { name: 'user1' }
        ]
      }
    ]
    return (
      <div className="roles">
        <Header />
        <div className="rows">
          {roles.map(role =>
            <Column
              role={role}
            />
          )}
        </div>
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  messages: chatroom.messages
}), ({ getMessages }))(Messages)
