import React from 'react'
import Flex from 'styled-flex-component'

import Icon from '../../../../components/Pages/Dashboard/Flows/Edit/Steps/Item/Icon'

import { StepContainer } from './styled'

interface Props {
  step: IBrandFlowStep
}

export default function Step({ step }: Props) {
  return (
    <StepContainer alignCenter justifyBetween>
      <Flex alignCenter>
        <Icon type={step.event ? step.event.task_type : 'Email'} />
        <div>{step.title}</div>
      </Flex>
      <div>
        {step.wait_days === 0 && 'The same day'}
        {step.wait_days > 0 && `Wait for ${step.wait_days} `}
        {step.wait_days === 1 && 'day'}
        {step.wait_days > 1 && 'days'}
      </div>
    </StepContainer>
  )
}
