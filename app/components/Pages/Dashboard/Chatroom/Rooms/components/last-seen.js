import React from 'react'
import { connect } from 'react-redux'

import { RelativeTime } from 'components/RelativeTime'

class LastSeen extends React.Component {
  constructor(props) {
    super(props)
  }

  getLastSeenAt(states, user) {
    const userStatus = states[user.id] || {}

    if (userStatus.state === 'Online') {
      return 'Online'
    }

    if (!user.last_seen_at) {
      return 'Offline'
    }

    return <RelativeTime time={user.last_seen_at} />
  }

  getIcon(user) {
    if (!user.last_seen_by) {
      return
    }

    const { client_type } = user.last_seen_by
    const iconName = client_type === 'Mobile' ? 'mobile' : 'globe'

    return (
      <i
        className={`fa fa-${iconName}`}
        style={{ fontSize: '16px', marginRight: '5px' }}
      />
    )
  }

  render() {
    const { user, states } = this.props

    return (
      <div>
        <div className="status">
          {this.getIcon(user)}
          {this.getLastSeenAt(states, user)}
        </div>
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  states: chatroom.states
}))(LastSeen)
