import React from 'react'

import Tooltip from 'components/tooltip'

import { Label, Star, Value } from 'components/inline-editable-fields/styled'

export function ViewMode(props) {
  return (
    <React.Fragment>
      <Label
        data-test={`contact-attribute${props.title ? `-${props.title}` : ''}`}
      >
        {props.title}
        {props.is_primary && (
          <Tooltip caption="Primary">
            <Star style={{ marginLeft: props.title ? '0.5rem' : 0 }} />
          </Tooltip>
        )}
      </Label>
      <Value>{props.value || '-'}</Value>
    </React.Fragment>
  )
}
