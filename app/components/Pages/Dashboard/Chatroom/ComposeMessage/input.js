import React from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize'
import Mentions from './mention'

class MessageInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 40,
    }
  }

  onHeightChangeHandler(height) {
    const { onHeightChange } = this.props

    this.setState({ height: height + 5 }, () => {
      onHeightChange(height)
    })
  }

  setReference(ref) {
    const { inputRef } = this.props
    this.text_message = ref
    inputRef(ref)
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  getUsersList() {
    const { users } = this.props

    const usersList = users.map(user => ({
      id: user.id,
      avatar: user.profile_image_url,
      name: user.display_name,
      email: user.email,
      username: user.username || user.abbreviated_display_name
    }))

    usersList.unshift({
      id: -1,
      avatar: '/static/images/dashboard/rebot@2x.png',
      username: 'Room',
      name: 'Notify every member in this room'
    })

    return usersList
  }

  render() {
    const { height } = this.state

    return (
      <div
        className="message-create"
        style={{ height: `${height}px` }}
      >
        <Mentions
          handler="compose-message"
          source={this.getUsersList()}
          position={height}
          trigger="@"
        />

        <Textarea
          autoFocus
          id="compose-message"
          dir="auto"
          placeholder="Write a message ..."
          maxRows={5}
          inputRef={ref => this.setReference(ref)}
          onHeightChange={height => this.onHeightChangeHandler(height)}
          onKeyPress={e => this.onKeyPress(e)}
        />
      </div>
    )
  }
}

function mapStateToProps({ chatroom }, props) {
  const room = chatroom.rooms[props.roomId]

  return {
    users: room ? room.users : null
  }
}
export default connect(mapStateToProps)(MessageInput)
