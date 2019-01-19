import React from 'react'
import { connect } from 'react-redux'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import TaskStatus from './Status'
import TaskNotifications from './Notification'

import ActionsButton from '../../../../components/ActionsButton'
import TaskFiles from '../TaskFiles'

import {
  RowContainer,
  Row,
  RowLeftColumn,
  RowRightColumn,
  RowTitle,
  RowArrowIcon
} from '../../styled'

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

  isRowExpandable = () => {
    const { attachments } = this.props.task.room

    return (
      this.props.task.form ||
      (Array.isArray(attachments) && attachments.length > 0)
    )
  }

  render() {
    const { task } = this.props
    const isRowExpandable = this.isRowExpandable()

    return (
      <RowContainer>
        <Row>
          <RowLeftColumn onClick={this.toggleTaskOpen}>
            <RowArrowIcon
              isOpen={this.state.isTaskExpanded}
              display={isRowExpandable}
            />
            <RowTitle hoverable={isRowExpandable}>{task.title}</RowTitle>
          </RowLeftColumn>

          <RowRightColumn>
            {/* <TaskStatus
              task={task}
              isBackOffice={this.props.isBackOffice}
              isDraftDeal={this.props.deal.is_draft}
            /> */}
            <TaskNotifications task={task} onClick={this.handleSelectTask} />

            <ActionsButton type="task" deal={this.props.deal} task={task} />
          </RowRightColumn>
        </Row>

        <TaskFiles
          isOpen={this.state.isTaskExpanded}
          task={task}
          deal={this.props.deal}
          isBackOffice={this.props.isBackOffice}
        />
      </RowContainer>
    )
  }
}

export default connect(
  null,
  { setSelectedTask, setExpandTask, updateDealNotifications }
)(Task)
