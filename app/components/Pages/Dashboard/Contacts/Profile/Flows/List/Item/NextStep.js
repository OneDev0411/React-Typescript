import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { eventTypesIcons } from 'views/utils/event-types-icons'

import { NextStepContainer } from './styled'

NextStep.propTypes = {
  flow: PropTypes.shape().isRequired
}

function NextStep({ flow }) {
  const { starts_at } = flow

  const nextSteps = flow.steps.filter(
    ({ crm_task, email }) =>
      (crm_task && crm_task.due_date >= starts_at) ||
      (email && email.due_at >= starts_at)
  )

  if (nextSteps.length === 0) {
    return null
  }

  let Icon
  let nextStepDetail = {}
  const [nextStep] = nextSteps
  const { email, crm_task } = nextStep

  if (email) {
    nextStepDetail = {
      at: email.due_at,
      type: email.due_at > email.created_at ? 'Auto Email' : 'Email Reminder'
    }
    Icon = eventTypesIcons.Email.icon
  } else {
    nextStepDetail = {
      at: crm_task.due_date,
      type: `${crm_task.task_type} Reminder`
    }
    Icon = eventTypesIcons[crm_task.task_type].icon
  }

  const now = new Date().getTime() / 1000
  const missedStepsCount = flow.steps.filter(
    ({ crm_task }) =>
      crm_task && crm_task.status === 'PENDING' && crm_task.due_date < now
  ).length

  return (
    <NextStepContainer>
      <div className="upcoming small-text">Upcoming</div>
      <Flex alignCenter>
        {Icon && <Icon className="next-step__icon" />}
        <div className="next-step__detail">
          {nextStepDetail.type}
          {' on '}
          {fecha.format(new Date(nextStepDetail.at * 1000), 'MMM DD, hh:mm A')}
        </div>
      </Flex>
      {missedStepsCount > 0 && (
        <div className="missed-steps small-text">{`${missedStepsCount} Missed Steps`}</div>
      )}
    </NextStepContainer>
  )
}

export default NextStep
