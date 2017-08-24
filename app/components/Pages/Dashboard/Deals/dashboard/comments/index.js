import React from 'react'
import { connect } from 'react-redux'
import Comments from '../../../Chatroom/Messages/light'
import { addNewRoom } from '../../../../../../store_actions/chatroom/room'

class Comment extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { addNewRoom } = this.props
    const { rooms, task } = nextProps

    if (task && !rooms[task.room.id]) {
      addNewRoom(task.room)
    }
  }

  render() {
    const { task, user } = this.props

    if (!task) {
      return false
    }

    return (
      <div className="deal-comments chatroom">
        <div className="comment-heading">Comment</div>

        <Comments
          user={user}
          roomId={task.room.id}
        />
      </div>
    )
  }
}

export default connect(({ data, chatroom }) => ({
  rooms: chatroom.rooms,
  user: data.user
}), { addNewRoom })(Comment)
