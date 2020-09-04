import React from 'react'
import { connect } from 'react-redux'
import { mdiEarth, mdiCellphone } from '@mdi/js'
import { Box } from '@material-ui/core'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'
import { muiIconSizes } from 'components/SvgIcons/icon-sizes'
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
    const iconName = client_type === 'Mobile' ? mdiCellphone : mdiEarth

    return <SvgIcon path={iconName} size={muiIconSizes.small} rightMargined />
  }

  render() {
    const { user, states } = this.props

    return (
      <div>
        <Box display="flex" alignItems="center" className="status">
          {this.getIcon(user)}
          {this.getLastSeenAt(states, user)}
        </Box>
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  states: chatroom.states
}))(LastSeen)
