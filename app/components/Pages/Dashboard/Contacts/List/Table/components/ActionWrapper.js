import React from 'react'
import styled from 'styled-components'

import Tooltip from 'components/tooltip'

function getCaption(action, atLeast = 'one', bulkMode = false) {
  let entityName = 'contact'

  if (atLeast !== 'one') {
    entityName = 'contacts'
  }

  return bulkMode
    ? 'You can not use this action in bulk selection mode.'
    : `You need to have at least ${atLeast} ${entityName} selected before ${action}.`
}

const DisabledActionContainer = styled.div`
  > button {
    pointer-events: none;
  }
`

export function ActionWrapper({
  children,
  disabled,
  action,
  atLeast,
  bulkMode
}) {
  return disabled ? (
    <Tooltip placement="bottom" caption={getCaption(action, atLeast, bulkMode)}>
      <DisabledActionContainer>{children}</DisabledActionContainer>
    </Tooltip>
  ) : (
    children
  )
}
