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
        id: 'role1',
        title: 'test1',
        users: [
          {
            id: 'user1',
            name: 'user1',
            display_name: 'user1'
          }
        ]
      },
      {
        id: 'role2',
        title: 'test2',
        users: [
          {
            id: 'user2',
            name: 'user1',
            display_name: 'user2'
          }
        ]
      }
    ]
    return (
      <div className="roles">
        <Header />
        <div className="rows">
          {roles.map(role =>
            <Column
              key={`ROLE_${role.id}`}
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
