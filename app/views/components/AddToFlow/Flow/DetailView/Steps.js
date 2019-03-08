import React from 'react'
import PropTypes from 'prop-types'

import { Step } from './Step'
import { StepsContainer } from './styled'

Steps.propTypes = {
  activeSteps: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  steps: PropTypes.arrayOf(PropTypes.shape()).isRequired
}

export function Steps(props) {
  return (
    <StepsContainer>
      {props.steps.map((step, index) => (
        <Step
          index={index}
          key={step.id}
          onChange={props.onChange}
          selected={props.activeSteps.includes(step.id)}
          step={step}
        />
      ))}
    </StepsContainer>
  )
}
