import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

class LastSeen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 0
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.tick.bind(this), 60 * 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  tick() {
    const { counter } = this.state
    this.setState({ counter: counter + 1 })
  }

  getLastSeen(states, user) {

    console.log(user)
    const userStatus = states[user.id]

    if (userStatus.state === 'Online')
      return 'Online'

    if (userStatus.last_seen_at)
      return this.agoTime(userStatus.last_seen_at)

    if (!user.last_seen_at)
      return 'Offline'

    return this.agoTime(user.last_seen_at)
  }

  agoTime(time) {
    return moment.unix(time).fromNow()
  }

  render() {
    const { user, states } = this.props

    return (
      <div>
        <div className="status">
          { this.getLastSeen(states, user) }
        </div>
      </div>
    )
  }
}

export default connect(({ chatroom }) => ({
  states: chatroom.states
}))(LastSeen)
