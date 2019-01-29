import React from 'react'
import { connect } from 'react-redux'
import Flex from 'styled-flex-component'
import moment from 'moment'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import { TextMiddleTruncate } from 'components/TextMiddleTruncate'
import Tooltip from 'components/tooltip'

import TaskStatus from './Status'
import TaskNotifications from '../Notification'

import ActionsButton from '../../../../components/ActionsButton'
import TaskFiles from '../TaskFiles'

import EnvelopeView from './Envelope'

import {
  RowContainer,
  Row,
  RowLeftColumn,
  RowRightColumn,
  TaskInfo,
  LastActivity,
  RowTitle,
  RowArrowIcon,
  ActivitySeparator
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

  normalizeActivityComment = comment => comment.replace(/\./gi, '')

  render() {
    const isRowExpandable = this.isRowExpandable()
    const latestActivity = this.props.task.room.latest_activity

    return (
      <RowContainer>
        <Row>
          <RowLeftColumn>
            <Flex onClick={this.toggleTaskOpen}>
              <RowArrowIcon
                isOpen={this.state.isTaskExpanded}
                display={isRowExpandable}
              />
              <RowTitle hoverable={isRowExpandable}>
                {this.props.task.title}
              </RowTitle>
            </Flex>

            <TaskInfo>
              <TaskStatus
                task={this.props.task}
                isBackOffice={this.props.isBackOffice}
                isDraftDeal={this.props.deal.is_draft}
              />

              {latestActivity && latestActivity.comment && (
                <LastActivity>
                  <TextMiddleTruncate
                    text={this.normalizeActivityComment(latestActivity.comment)}
                    maxLength={35}
                    tooltipPlacement="bottom"
                  />

                  <ActivitySeparator>.</ActivitySeparator>

                  <Tooltip
                    placement="bottom"
                    caption={moment
                      .unix(latestActivity.created_at)
                      .format('MMM DD, YYYY, hh:mm A')}
                  >
                    <span>
                      {moment.unix(latestActivity.created_at).fromNow()}
                    </span>
                  </Tooltip>

                  <ActivitySeparator>.</ActivitySeparator>

                  <EnvelopeView deal={this.props.deal} task={this.props.task} />
                </LastActivity>
              )}
            </TaskInfo>
          </RowLeftColumn>

          <RowRightColumn>
            <TaskNotifications
              task={this.props.task}
              tooltip="View Activity"
              onClick={this.handleSelectTask}
            />

            <ActionsButton
              type="task"
              deal={this.props.deal}
              task={this.props.task}
            />
          </RowRightColumn>
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
