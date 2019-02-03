import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import TaskStatus from './Status'

import ActionsButton from '../../../../components/ActionsButton'
import TaskFiles from '../TaskFiles'

import TaskNotifications from '../Notification'
import EnvelopeView from '../Envelope'
import { Activity } from './Activity'

import {
  RowContainer,
  Row,
  TaskInfo,
  RowTitle,
  Activities,
  RowArrowIcon
} from '../../styled'

class Task extends React.Component {
  state = {
    isTaskExpanded: this.props.task.is_expanded === true
  }

  toggleTaskOpen = () => {
    if (this.isRowExpandable() === false) {
      return false
    }

    const isTaskExpanded = !this.state.isTaskExpanded

    this.setState({
      isTaskExpanded
    })

    this.props.setExpandTask(this.props.task.id, isTaskExpanded)
  }

  handleSelectTask = () => {
    if (this.props.task.room.new_notifications > 0) {
      this.props.updateDealNotifications(this.props.deal, this.props.task.room)
    }

    this.props.setSelectedTask(this.props.task)
  }

  isRowExpandable = () => {
    const { attachments } = this.props.task.room

    return (
      this.props.task.form ||
      (Array.isArray(attachments) && attachments.length > 0)
    )
  }

  render() {
    const isRowExpandable = this.isRowExpandable()

    return (
      <RowContainer isTaskExpanded={this.state.isTaskExpanded}>
        <Row>
          <RowArrowIcon
            isOpen={this.state.isTaskExpanded}
            display={isRowExpandable}
            onClick={this.toggleTaskOpen}
          />

          <Flex column style={{ flex: 1 }}>
            <Flex alignCenter justifyBetween>
              <RowTitle
                hoverable={isRowExpandable}
                onClick={this.toggleTaskOpen}
              >
                {this.props.task.title}
              </RowTitle>

              <ActionsButton
                type="task"
                deal={this.props.deal}
                task={this.props.task}
              />
            </Flex>

            <Flex alignCenter>
              <TaskStatus
                task={this.props.task}
                isBackOffice={this.props.isBackOffice}
                isDraftDeal={this.props.deal.is_draft}
              />

              <EnvelopeView
                type="task"
                deal={this.props.deal}
                task={this.props.task}
              />

              <Activities>
                <TaskNotifications
                  task={this.props.task}
                  tooltip="View Activity"
                  tooltipPlacement="bottom"
                  style={{ marginTop: '-3px' }}
                />

                <Activity
                  task={this.props.task}
                  latestActivity={this.props.task.room.latest_activity}
                  onSelectTask={this.handleSelectTask}
                />
              </Activities>
            </Flex>
          </Flex>
        </Row>

        <TaskFiles
          isOpen={this.state.isTaskExpanded}
          task={this.props.task}
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
