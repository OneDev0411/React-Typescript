import React from 'react'
import { connect } from 'react-redux'

import TaskStatus from './Status'
import TaskNotifications from './Notification'

import { setSelectedTask, updateDealNotifications } from 'actions/deals'

import { Container, LeftColumn, RightColumn, Title, ArrowIcon } from './styled'

class Task extends React.Component {
  state = {
    isTaskExpanded: false
  }

  toggleTaskOpen = () =>
    this.setState(state => ({
      isTaskExpanded: !state.isTaskExpanded
    }))

  handleSelectTask = () => {
    const { task } = this.props

    if (task.room.new_notifications > 0) {
      this.props.updateDealNotifications(this.props.deal, task.room)
    }

    this.props.setSelectedTask(task)
  }

  render() {
    const { task } = this.props

    return (
      <Container>
        <LeftColumn>
          <ArrowIcon
            isOpen={this.state.isTaskExpanded}
            onClick={this.toggleTaskOpen}
          />
          <Title onClick={this.handleSelectTask}>{task.title}</Title>
        </LeftColumn>

        <RightColumn onClick={this.handleSelectTask}>
          <TaskStatus task={task} isDraftDeal={this.props.deal.is_draft} />
          <TaskNotifications task={task} />
        </RightColumn>
      </Container>
    )
  }
}

export default connect(
  null,
  { setSelectedTask, updateDealNotifications }
)(Task)
