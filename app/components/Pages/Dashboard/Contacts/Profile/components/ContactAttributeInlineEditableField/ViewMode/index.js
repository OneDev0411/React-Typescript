import React from 'react'

import Tooltip from 'components/tooltip'

import { Label, Star, Value } from 'components/inline-editable-fields/styled'

export function ViewMode(props) {
  return (
    <React.Fragment>
      <Label>
        {props.title}
        {props.is_primary && (
          <Tooltip caption="Primary">
            <Star />
          </Tooltip>
        )}
      </Label>
      <Value>{props.value || '-'}</Value>
    </React.Fragment>
  )
}
