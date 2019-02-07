import React from 'react'
import { connect } from 'react-redux'
import _ from 'underscore'

import { setSelectedTask, updateDealNotifications } from 'actions/deals'

import ActionButton from 'components/Button/ActionButton'

import { Container, BadgeCounter } from './styled'

class MessageAdmin extends React.Component {
  getGeneralTaskId() {
    const taskId = _.find(
      this.props.checklist.tasks,
      id => this.props.tasks[id].task_type === 'GeneralComments'
    )

    return taskId ? this.props.tasks[taskId] : null
  }

  handleSelectTask = (task, room) => {
    this.props.setSelectedTask(task)

    if (room.new_notifications > 0) {
      this.props.updateDealNotifications(this.props.deal, room)
    }
  }

  render() {
    const task = this.getGeneralTaskId()

    if (!task) {
      return false
    }

    const room = this.props.rooms[task.room.id]
      ? this.props.rooms[task.room.id]
      : task.room

    const { new_notifications } = room

    return (
      <Container>
        <ActionButton
          size="small"
          onClick={() => this.handleSelectTask(task, room)}
        >
          General Comments
        </ActionButton>

        {new_notifications > 0 && (
          <BadgeCounter>{new_notifications}</BadgeCounter>
        )}
      </Container>
    )
  }
}

function mapStateToProps({ chatroom, deals }) {
  return {
    rooms: chatroom.rooms || {},
    tasks: deals.tasks
  }
}

export default connect(
  mapStateToProps,
  { setSelectedTask, updateDealNotifications }
)(MessageAdmin)
