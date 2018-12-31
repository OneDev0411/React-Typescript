import React from 'react'
import { connect } from 'react-redux'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import TaskStatus from './Status'
import TaskNotifications from './Notification'

import TaskFiles from '../TaskFiles'

import {
  Container,
  Row,
  LeftColumn,
  RightColumn,
  Title,
  ArrowIcon
} from './styled'

class Task extends React.Component {
  state = {
    isTaskExpanded: this.props.task.is_expanded === true
  }

  toggleTaskOpen = () => {
    const isTaskExpanded = !this.state.isTaskExpanded

    this.setState({
      isTaskExpanded
    })

    this.props.setExpandTask(this.props.task.id, isTaskExpanded)
  }

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
        <Row>
          <LeftColumn onClick={this.toggleTaskOpen}>
            <ArrowIcon isOpen={this.state.isTaskExpanded} />
            <Title>{task.title}</Title>
          </LeftColumn>

          <RightColumn>
            <TaskStatus
              task={task}
              isBackOffice={this.props.isBackOffice}
              isDraftDeal={this.props.deal.is_draft}
            />
            <TaskNotifications task={task} onClick={this.handleSelectTask} />
          </RightColumn>
        </Row>

        <TaskFiles
          isOpen={this.state.isTaskExpanded}
          task={task}
          deal={this.props.deal}
          isBackOffice={this.props.isBackOffice}
        />
      </Container>
    )
  }
}

export default connect(
  null,
  { setSelectedTask, setExpandTask, updateDealNotifications }
)(Task)
