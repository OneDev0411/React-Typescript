import React from 'react'
import { connect } from 'react-redux'

import Comments from '../../../Chatroom/Messages/light'
import TaskRoom from '../../../../../../services/notification/chat'
import { addNewRoom } from '../../../../../../store_actions/chatroom/room'
import { isBackOffice } from '../../../../../../utils/user-teams'

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
    const room = rooms && rooms[task.room.id]

    if (task && !room) {
      addNewRoom(task.room)
    }

    TaskRoom.clear(task.room.id)
  }

  render() {
    const { task, user, isBackOffice } = this.props

    if (!task) {
      return false
    }

    return (
      <div className="deal-comments chatroom">
        <div className="comment-heading">Comment</div>
        <Comments
          user={user}
          roomId={task.room.id}
          deliveryReportPlacement="bottom"
          openFilesInNewTab={!isBackOffice}
        />
      </div>
    )
  }
}

export default connect(
  ({ user, chatroom }) => ({
    rooms: chatroom.rooms,
    isBackOffice: isBackOffice(user),
    user
  }),
  { addNewRoom }
)(Comment)
