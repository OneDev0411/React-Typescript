import React from 'react'

import Tooltip from 'components/tooltip'

import { Label, Star, Address } from './styled'

export function ViewMode({ address }) {
  let label = address.label

  if (!address.label) {
    label = address.id ? '' : 'Home'
  }

  return (
    <React.Fragment>
      <Label>
        {label}
        {address.is_primary && (
          <Tooltip caption="Primary Address">
            <Star style={{ marginLeft: label ? '0.5rem' : 0 }} />
          </Tooltip>
        )}
      </Label>
      <Address>{address.full_address || '-'}</Address>
    </React.Fragment>
  )
}
