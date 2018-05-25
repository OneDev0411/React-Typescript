import React from 'react'
import { string } from 'prop-types'

import { icons } from './icons'
import FlexContainer from '../../../../../../components/FlexContainer'

TypeCell.propTypes = {
  type: string.isRequired
}

export function TypeCell({ type }) {
  if (!icons[type]) {
    return null
  }

  const Icon = icons[type].icon

  return (
    <FlexContainer>
      <Icon />
      <span style={{ lineHeight: 1, marginLeft: 8 }}>{type}</span>
    </FlexContainer>
  )
}
