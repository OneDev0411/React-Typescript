import React from 'react'

import Step from './Step'
import { StepsContainer } from './styled'

interface Props {
  steps: IBrandFlowStep[]
}

export default function Steps({ steps }: Props) {
  return (
    <StepsContainer className="u-scrollbar--thinner--self">
      {steps.map(step => {
        return <Step key={step.id} step={step} />
      })}
    </StepsContainer>
  )
}
