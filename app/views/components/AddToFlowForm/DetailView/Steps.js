import React from 'react'
import PropTypes from 'prop-types'

import Step from './Step'
import { StepsContainer } from './styled'

Steps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

export default function Steps(props) {
  return (
    <StepsContainer className="u-scrollbar--thinner--self">
      {props.steps.map((step, index) => (
        <Step index={index} key={step.id} step={step} />
      ))}
    </StepsContainer>
  )
}
