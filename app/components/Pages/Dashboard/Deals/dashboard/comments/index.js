import React from 'react'
import { connect } from 'react-redux'
import ReactTooltip from 'react-tooltip'
import Comments from '../../../Chatroom/Messages/light'
import TaskRoom from '../../../Chatroom/Services/notification'
import { addNewRoom } from '../../../../../../store_actions/chatroom/room'

class Comment extends React.Component {

  componentDidMount() {
    const { task, rooms } = this.props
    this.getRoom(task, rooms)
  }

  componentWillReceiveProps(nextProps) {
    const { task, rooms } = nextProps
    this.getRoom(task, rooms)
  }

  getRoom(task, rooms) {
    const { addNewRoom } = this.props
    const room = rooms[task.room.id]

    if (task && !room) {
      addNewRoom(task.room)
    }

    TaskRoom.clear(task.room.id)
  }

  render() {
    const { task, user } = this.props

    if (!task) {
      return false
    }

    return (
      <div className="deal-comments chatroom">
        <ReactTooltip
          place="top"
          className="deal-filter--tooltip"
          multiline
        />

        <div className="comment-heading">Comment</div>
        <Comments
          user={user}
          roomId={task.room.id}
          deliveryReportPlacement="bottom"
        />
      </div>
    )
  }
}

export default connect(({ data, chatroom }) => ({
  rooms: chatroom.rooms,
  user: data.user
}), { addNewRoom })(Comment)
