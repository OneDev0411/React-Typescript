import React from 'react'

import { connect } from 'react-redux'

import { addNewRoom } from 'actions/chatroom/room'
import TaskRoom from 'services/notification/chat'

import Comments from '../../../../Chatroom/Messages/light'

import { EmptyState } from './EmptyState'
import MessageInput from './MessageInput'
import { Container } from './styled'

class Comment extends React.Component {
  componentDidMount() {
    const { task, rooms } = this.props

    this.getRoom(task, rooms)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { task, rooms } = nextProps

    this.getRoom(task, rooms)
  }

  getRoom = (task, rooms) => {
    if (!task) {
      return false
    }

    const { addNewRoom } = this.props
    const room = rooms && rooms[task.room.id]

    if (task && !room) {
      addNewRoom(task.room)
    }

    TaskRoom.clear(task.room.id)
  }

  render() {
    const { task } = this.props

    if (!task) {
      return false
    }

    return (
      <Container
        className="chatroom"
        isPrivateRoom={task.acl.includes('Agents') === false}
      >
        <Comments
          user={this.props.user}
          roomId={task.room.id}
          deliveryReportPlacement="bottom"
          openFilesInNewTab={!this.props.isBackOffice}
          emptyStateRenderer={() => <EmptyState />}
          onLoad={this.props.onLoadComments}
        />

        <MessageInput
          deal={this.props.deal}
          task={task}
          isBackOffice={this.props.isBackOffice}
          onSendMessage={this.props.onSendMessage}
          autoFocus
        />
      </Container>
    )
  }
}

export default connect(
  ({ user, chatroom }) => ({
    rooms: chatroom.rooms,
    user
  }),
  { addNewRoom }
)(Comment)
