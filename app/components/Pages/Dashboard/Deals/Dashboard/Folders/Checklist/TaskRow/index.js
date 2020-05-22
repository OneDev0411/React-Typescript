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

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

import TaskStatus from './Status'

import ActionsButton from '../../../../components/ActionsButton'

import { TaskFiles } from '../TaskFiles'
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

    this.setState(
      state => ({
        isTaskExpanded: !state.isTaskExpanded
      }),
      () => {
        this.props.setExpandTask(this.props.task.id, this.state.isTaskExpanded)
      }
    )
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

  isRowClickable = () => {
    const rowsCount = this.getRowsCount()

    return rowsCount > 0 || this.hasDigitalForm
  }

  get hasDigitalForm() {
    return this.props.task.form !== null
  }

  getAttachments = () => {
    const { attachments } = this.props.task.room

    return Array.isArray(attachments) ? attachments : []
  }

  getRowsCount = () => {
    const attachmentsCount = this.getAttachments().length

    return this.props.task.submission ? attachmentsCount + 1 : attachmentsCount
  }

  /**
   * handles clicking task row based on different scenarios
   * https://gitlab.com/rechat/web/issues/2341
   */
  handleClickTask = () => {
    const { props } = this
    const rowsCount = this.getRowsCount()

    // If only a base form in there, when user taps on task open up the form as if they pressed Edit ... also wheen the forms is editeed and saved you show the PDF saved version but you should still show the base form when user presses on the name of task ... but once user has an envelope then you show the envelope.
    // If task is empty, i.e no form and no uploaded file: clicking task name does nothing (it's not clickable)
    if (rowsCount === 0 && !this.IsFormTask) {
      return (
        this.hasDigitalForm &&
        browserHistory.push(
          `/dashboard/deals/${props.deal.id}/form-edit/${props.task.id}`
        )
      )
    }

    // If there are many files in the task such as: a form and an uploaded file, or multiple uploaded files ... tapping on task name should expand and open up thee task to show the multiple files under it for user to then select the file they are interested in
    if (rowsCount > 1) {
      this.toggleTaskOpen()

      return
    }

    const envelopes = getTaskEnvelopes(props.envelopes, props.task)

    // If there is a form and an envelope in the task: we should open up the envelop version in the view/print (so for instance if there is a base form and then a signed copy of the envelop, tapping on the task name should open up the version with signatures on them.)
    if (envelopes.length > 0) {
      browserHistory.push(
        `/dashboard/deals/${props.deal.id}/view/${props.task.id}/envelope/${envelopes[0].id}`
      )

      return
    }

    // If there is only one item in the task, whether it's a form, or an uploaded file: tapping on task name should open up that file as it does with view and print
    let link

    if (props.isBackOffice) {
      link = props.task.submission
        ? `/dashboard/deals/${props.deal.id}/view/${props.task.id}`
        : `/dashboard/deals/${props.deal.id}/view/${props.task.id}/attachment/${props.task.room.attachments[0].id}`
      browserHistory.push(link)

      return
    }

    link = props.task.submission
      ? props.task.pdf_url
      : props.task.room.attachments[0].url

    window.open(link, '_blank')
  }

  render() {
    const { props, state } = this

    return (
      <RowContainer isTaskExpanded={state.isTaskExpanded}>
        <Row>
          <RowArrowIcon
            isOpen={state.isTaskExpanded}
            show={this.isRowExpandable()}
            onClick={this.toggleTaskOpen}
          />

          <Flex column style={{ flex: 1 }}>
            <Flex alignCenter justifyBetween>
              <RowTitle
                clickable={this.isRowClickable()}
                onClick={this.handleClickTask}
              >
                {props.task.title}
              </RowTitle>

              <Flex alignCenter>
                <TaskNotifications
                  onClick={this.handleSelectTask}
                  task={props.task}
                  tooltip="View Activity"
                  tooltipPlacement="bottom"
                  style={{ margin: '-3px 0.625rem 0 0' }}
                />

                <ActionsButton
                  type="task"
                  deal={props.deal}
                  task={props.task}
                />
              </Flex>
            </Flex>

            <Flex alignCenter wrapReverse>
              <TaskStatus
                task={props.task}
                isBackOffice={props.isBackOffice}
                isDraftDeal={props.deal.is_draft}
              />

              <EnvelopeView type="task" deal={props.deal} task={props.task} />

              <Activity
                onClick={this.handleSelectTask}
                task={props.task}
                latestActivity={props.task.room.latest_activity}
              />
            </Flex>
          </Flex>
        </Row>

        <TaskFiles
          isOpen={state.isTaskExpanded}
          task={props.task}
          deal={props.deal}
          isBackOffice={props.isBackOffice}
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

export default connect(mapStateToProps, {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
})(Task)
