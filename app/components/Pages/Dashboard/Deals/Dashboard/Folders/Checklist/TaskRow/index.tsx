import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { browserHistory } from 'react-router'
import Flex from 'styled-flex-component'

import {
  setSelectedTask,
  setExpandTask,
  updateDealNotifications
} from 'actions/deals'

import { selectDealEnvelopes } from 'reducers/deals/envelopes'

import { getTaskEnvelopes } from 'views/utils/deal-files/get-task-envelopes'

import { IAppState } from 'reducers'

import { TaskStatus } from './Status'

import ActionsButton from '../../../../components/ActionsButton'

import { TaskItems } from '../TaskItems'
import TaskNotifications from '../Notification'
import { EnvelopeStatus } from '../EnvelopeStatus'
import { Activity } from './Activity'

import { RowContainer, Row, RowTitle, RowArrowIcon } from '../../styled'

interface Props {
  deal: IDeal
  task: IDealTask & { is_expanded?: boolean }
  isBackOffice: boolean
}

export function TaskRow({ deal, task, isBackOffice }: Props) {
  const [isTaskExpanded, setIsTaskExpanded] = useState(
    task.is_expanded === true
  )

  const dispatch = useDispatch()

  const envelopes = useSelector<IAppState, IDealEnvelope[]>(({ deals }) =>
    selectDealEnvelopes(deal, deals.envelopes)
  )

  const getRowsCount = () => {
    let count = 0

    if (task.form) {
      count++
    }

    count += (task.room.attachments || []).length
    count += (getTaskEnvelopes(envelopes, task) || []).length

    return count
  }

  const toggleTaskOpen = () => {
    if (!isRowExpandable) {
      return
    }

    dispatch(setExpandTask(task.id, !isTaskExpanded))
    setIsTaskExpanded(state => !state)
  }

  const handleSelectTask = () => {
    if (task.room.new_notifications > 0) {
      dispatch(updateDealNotifications(deal, task.room))
    }

    dispatch(setSelectedTask(task))
  }

  /**
   * handles clicking task row based on different scenarios
   * https://gitlab.com/rechat/web/issues/2341
   */
  const handleClickTask = () => {
    const rowsCount = getRowsCount()

    // If only a base form in there, when user taps on task open up the form as if they pressed Edit ... also when the forms is edited and saved you show the PDF saved version but you should still show the base form when user presses on the name of task ... but once user has an envelope then you show the envelope.
    // If task is empty, i.e no form and no uploaded file: clicking task name does nothing (it's not clickable)
    if (rowsCount === 0) {
      return (
        task.form &&
        browserHistory.push(`/dashboard/deals/${deal.id}/form-edit/${task.id}`)
      )
    }

    // If there are many files in the task such as: a form and an uploaded file, or multiple uploaded files ... tapping on task name should expand and open up thee task to show the multiple files under it for user to then select the file they are interested in
    if (rowsCount > 1) {
      toggleTaskOpen()

      return
    }

    const taskEnvelopes = getTaskEnvelopes(envelopes, task)

    // If there is a form and an envelope in the task: we should open up the envelop version in the view/print (so for instance if there is a base form and then a signed copy of the envelop, tapping on the task name should open up the version with signatures on them.)
    if (taskEnvelopes.length > 0) {
      browserHistory.push(
        `/dashboard/deals/${deal.id}/view/${task.id}/envelope/${taskEnvelopes[0].id}`
      )

      return
    }

    // If there is only one item in the task, whether it's a form, or an uploaded file: tapping on task name should open up that file as it does with view and print
    let link = ''

    if (isBackOffice) {
      link = task.submission
        ? `/dashboard/deals/${deal.id}/view/${task.id}`
        : `/dashboard/deals/${deal.id}/view/${task.id}/attachment/${
            (task.room.attachments || [])[0].id
          }`
      browserHistory.push(link)

      return
    }

    link = task.submission ? task.pdf_url : (task.room.attachments || [])[0].url

    window.open(link, '_blank')
  }

  const isRowExpandable = getRowsCount() > 1

  return (
    <RowContainer isTaskExpanded={isTaskExpanded}>
      <Row>
        <RowArrowIcon
          onClick={toggleTaskOpen}
          show={isRowExpandable}
          isOpen={isTaskExpanded}
        />

        <Flex column style={{ flex: 1 }}>
          <Flex alignCenter justifyBetween>
            <RowTitle clickable onClick={handleClickTask}>
              {task.title}
            </RowTitle>

            <Flex alignCenter>
              <TaskNotifications
                onClick={handleSelectTask}
                task={task}
                tooltip="View Activity"
                tooltipPlacement="bottom"
                style={{ margin: '-3px 0.625rem 0 0' }}
              />

              <ActionsButton type="task" deal={deal} task={task} />
            </Flex>
          </Flex>

          <Flex alignCenter wrapReverse>
            <TaskStatus deal={deal} task={task} isBackOffice={isBackOffice} />
            <EnvelopeStatus type="task" deal={deal} task={task} />
            <Activity task={task} onClick={handleSelectTask} />
          </Flex>
        </Flex>
      </Row>

      <TaskItems
        isOpen={isTaskExpanded}
        task={task}
        deal={deal}
        isBackOffice={isBackOffice}
      />
    </RowContainer>
  )
}
