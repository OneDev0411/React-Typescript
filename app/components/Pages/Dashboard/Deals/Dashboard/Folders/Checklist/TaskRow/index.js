import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import TaskStatus from './Status'

import ActionsButton from '../../../../components/ActionsButton'
import { getTaskEnvelopes } from '../../../../utils/get-task-envelopes'

import TaskFiles from '../TaskFiles'
import TaskNotifications from '../Notification'
import EnvelopeView from '../Envelope'
import { Activity } from './Activity'

import { RowContainer, Row, RowTitle, RowArrowIcon } from '../../styled'

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

    return Array.isArray(attachments) && attachments.length > 0
  }

  isRowClickable = () => this.getRowsCount() > 0

  getRowsCount() {
    const { attachments } = this.props.task.room

    const attachmentsCount = Array.isArray(attachments) ? attachments.length : 0

    return this.props.task.submission ? attachmentsCount + 1 : attachmentsCount
  }

  /**
   * handles clicking task row based on different scenarios
   * https://gitlab.com/rechat/web/issues/2341
   */
  handleClickTask = () => {
    const rowsCount = this.getRowsCount()

    // If task is empty, i.e no form and no uploaded file: clicking task name does nothing (it's not clickable)
    if (rowsCount === 0) {
      return false
    }

    // If there are many files in the task such as: a form and an uploaded file, or multiple uploaded files ... tapping on task name should expand and open up thee task to show the multiple files under it for user to then select the file they are interested in
    if (rowsCount > 1) {
      return this.toggleTaskOpen()
    }

    const envelopes = getTaskEnvelopes(this.props.envelopes, this.props.task)

    // If there is a form and an envelope in the task: we should open up the envelop version in the view/print (so for instance if there is a base form and then a signed copy of the envelop, tapping on the task name should open up the version with signatures on them.)
    if (envelopes.length > 0) {
      return browserHistory.push(
        `/dashboard/deals/${this.props.deal.id}/view/${
          this.props.task.id
        }/envelope/${envelopes[0].id}`
      )
    }

    // If there is only one item in the task, whether it's a form, or an uploaded file: tapping on task name should open up that file as it does with view and print
    let link

    if (this.props.task.submission) {
      link = this.props.isBackOffice
        ? `/dashboard/deals/${this.props.deal.id}/view/${this.props.task.id}`
        : this.props.task.submission.file.url
    } else {
      link = this.props.task.room.attachments[0].url
    }

    return this.props.isBackOffice
      ? browserHistory.push(link)
      : window.open(link, '_blank')
  }

  render() {
    return (
      <RowContainer isTaskExpanded={this.state.isTaskExpanded}>
        <Row>
          <RowArrowIcon
            isOpen={this.state.isTaskExpanded}
            display={this.isRowExpandable()}
            onClick={this.toggleTaskOpen}
          />

          <Flex column style={{ flex: 1 }}>
            <Flex alignCenter justifyBetween>
              <RowTitle
                clickable={this.isRowClickable()}
                onClick={this.handleClickTask}
              >
                {this.props.task.title}
              </RowTitle>

              <Flex alignCenter>
                <TaskNotifications
                  onClick={this.handleSelectTask}
                  task={this.props.task}
                  tooltip="View Activity"
                  tooltipPlacement="bottom"
                  style={{ margin: '-3px 0.625rem 0 0' }}
                />

                <ActionsButton
                  type="task"
                  deal={this.props.deal}
                  task={this.props.task}
                />
              </Flex>
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

              <Activity
                onClick={this.handleSelectTask}
                task={this.props.task}
                latestActivity={this.props.task.room.latest_activity}
              />
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

function mapStateToProps({ deals }, props) {
  return {
    envelopes: selectDealEnvelopes(props.deal, deals.envelopes)
  }
}

export default connect(
  mapStateToProps,
  { setSelectedTask, setExpandTask, updateDealNotifications }
)(Task)
