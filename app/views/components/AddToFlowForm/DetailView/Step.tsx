import React from 'react'
import Flex from 'styled-flex-component'

import Icon from '../../../../components/Pages/Dashboard/Flows/Edit/Steps/Item/Icon'

import { StepContainer } from './styled'

interface Props {
  step: IBrandFlowStep
  waitDays: number
}

export default function Step({ step, waitDays }: Props) {
  return (
    <StepContainer alignCenter justifyBetween>
      <Flex alignCenter>
        <Icon type={step.event ? step.event.task_type : 'Email'} />
        <div>{step.title}</div>
      </Flex>
      <div>
        {waitDays === 0 && 'The same day'}
        {waitDays > 0 && `Wait for ${waitDays} `}
        {waitDays === 1 && 'day'}
        {waitDays > 1 && 'days'}
      </div>
    </StepContainer>
  )
}
