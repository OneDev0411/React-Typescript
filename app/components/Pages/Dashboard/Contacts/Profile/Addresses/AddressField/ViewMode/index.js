import React from 'react'

import Tooltip from 'components/tooltip'

import { Label, Star, Value } from 'components/inline-editable-fields/styled'

export function ViewMode({ address }) {
  let label = address.label

  if (!address.label) {
    label = address.id ? '-' : 'Home'
  }

  return (
    <React.Fragment>
      <Label>
        {label}
        {address.is_primary && (
          <Tooltip caption="Primary">
            <Star />
          </Tooltip>
        )}
      </Label>
      <Value>{address.full_address || '-'}</Value>
    </React.Fragment>
  )
}
