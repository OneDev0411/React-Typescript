import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import { eventTypesIcons } from 'views/utils/event-types-icons'
import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'

import Container from './styled'

Item.propTypes = {
  item: PropTypes.shape().isRequired
}

function Item({ item }) {
  const { starts_at } = item
  const nextSteps = item.steps.filter(
    ({ crm_task, email }) =>
      (crm_task && crm_task.due_date >= starts_at) ||
      (email && email.due_at >= starts_at)
  )

  let Icon
  let nextStepDetail = {}
  const [nextStep] = nextSteps
  const { email, crm_task } = nextStep
  const stepsLength = item.steps.length
  const currentStepNumber = stepsLength - nextSteps.length + 1

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

  return (
    <Container>
      <Flex justifyBetween>
        <Flex style={{ width: 'calc(100% - 2.5rem)' }}>
          <Flex center className="status" />
          <div className="title">{item.name}</div>
        </Flex>
        <Tooltip caption="Stop this flow" size="small">
          <IconButton isFit className="stop">
            <Flex center className="stop__icon" />
          </IconButton>
        </Tooltip>
      </Flex>
      <Flex alignCenter>
        {Icon && <Icon className="next-step-icon" />}
        {nextStepDetail.type}
        {' on '}
        {fecha.format(new Date(nextStepDetail.at * 1000), 'MMM DD, hh:mm A')}
      </Flex>
      <div className="next-step-counter">{`Step ${currentStepNumber} of ${stepsLength}`}</div>
    </Container>
  )
}

export default Item
