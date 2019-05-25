import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import fecha from 'fecha'

import Tooltip from 'components/tooltip'
import IconButton from 'components/Button/IconButton'
import StopIcon from 'components/SvgIcons/CircleStop/IconCircleStop'
import { eventTypesIcons } from 'views/utils/event-types-icons'

import Container from './styled'

Item.propTypes = {
  item: PropTypes.shape().isRequired,
  onStop: PropTypes.func.isRequired
}

function Item({ item, onStop }) {
  const { starts_at, id } = item

  const stop = useCallback(() => {
    onStop(id)
  }, [onStop, id])

  const nextSteps = item.steps.filter(
    ({ crm_task, email }) =>
      (crm_task && crm_task.due_date >= starts_at) ||
      (email && email.due_at >= starts_at)
  )

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
  const missedStepsCount = item.steps.filter(
    ({ crm_task }) =>
      crm_task && crm_task.status === 'PENDING' && crm_task.due_date < now
  ).length

  return (
    <Container>
      <Flex justifyBetween>
        <Flex style={{ width: 'calc(100% - 2.5rem)' }}>
          <Flex center className="status" />
          <div className="title">{item.name}</div>
        </Flex>
        <Tooltip caption="Stop this flow" size="small">
          <IconButton isFit inverse onClick={stop}>
            <StopIcon />
          </IconButton>
        </Tooltip>
      </Flex>
      <div className="upcoming small-text">Upcoming</div>
      <Flex alignCenter>
        {Icon && <Icon className="next-step__icon" />}
        {nextStepDetail.type}
        {' on '}
        {fecha.format(new Date(nextStepDetail.at * 1000), 'MMM DD, hh:mm A')}
      </Flex>
      {missedStepsCount > 0 && (
        <div className="missed-steps small-text">{`${missedStepsCount} Missed Steps`}</div>
      )}
    </Container>
  )
}

export default Item
