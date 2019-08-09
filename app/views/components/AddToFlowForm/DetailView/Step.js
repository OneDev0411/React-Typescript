import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import idx from 'idx'

import { eventTypesIcons } from 'views/utils/event-types-icons'

import { StepContainer } from './styled'

Step.propTypes = {
  step: PropTypes.shape().isRequired
}

export default function Step(props) {
  const { step } = props
  const days = Math.floor(step.due_in / (24 * 3600)) + 1
  let Icon = idx(eventTypesIcons, icons => icons[step.event.task_type].icon)

  if (!Icon && step.email) {
    Icon = eventTypesIcons.Email.icon
  }

  return (
    <StepContainer alignCenter justifyBetween>
      <Flex alignCenter>
        {Icon && <Icon />}
        <div>{step.title}</div>
      </Flex>
      <div>{`Day ${days}`}</div>
    </StepContainer>
  )
}
