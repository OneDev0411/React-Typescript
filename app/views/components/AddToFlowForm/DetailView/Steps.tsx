import React from 'react'

import { humanizeSeconds } from '../../../../components/Pages/Dashboard/Flows/Edit/helpers'

import Step from './Step'
import { StepsContainer } from './styled'

interface Props {
  steps: IBrandFlowStep[]
}

export default function Steps({ steps }: Props) {
  return (
    <StepsContainer className="u-scrollbar--thinner--self">
      {steps.map((step, index) => {
        const prevStepDueInDays =
          index === 0 ? 0 : humanizeSeconds(steps[index - 1].due_in).days
        const waitDays = humanizeSeconds(step.due_in).days - prevStepDueInDays

        return <Step key={step.id} step={step} waitDays={waitDays} />
      })}
    </StepsContainer>
  )
}
