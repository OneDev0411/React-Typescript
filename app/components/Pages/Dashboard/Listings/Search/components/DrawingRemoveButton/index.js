import React from 'react'

import { Button, Icon } from './styled'

export function DrawingRemoveButton(props) {
  if (Array.isArray(props.points) && props.points.length === 0) {
    return null
  }

  return (
    <Button onClick={props.onClick}>
      <Icon />
      Remove Draw
    </Button>
  )
}
