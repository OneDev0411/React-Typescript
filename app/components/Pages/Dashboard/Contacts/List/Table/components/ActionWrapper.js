import React from 'react'
import styled from 'styled-components'

import Tooltip from 'components/tooltip'

function getCaption(action, atLeast = 'one') {
  return `You need to have at least ${atLeast} contact selected before ${action}.`
}

const DisabledActionContainer = styled.div`
  > button {
    pointer-events: none;
  }
`

export function ActionWrapper(props) {
  return props.disabled ? (
    <Tooltip caption={getCaption(props.action, props.atLeast)}>
      <DisabledActionContainer>{props.children}</DisabledActionContainer>
    </Tooltip>
  ) : (
    props.children
  )
}
