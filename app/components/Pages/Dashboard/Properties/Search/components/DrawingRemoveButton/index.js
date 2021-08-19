import React from 'react'

import { mdiClose } from '@mdi/js'

import { Button, Icon } from './styled'

export function DrawingRemoveButton(props) {
  if (Array.isArray(props.points) && props.points.length === 0) {
    return null
  }

  return (
    <Button onClick={props.onClick}>
      <Icon path={mdiClose} />
      Remove Draw
    </Button>
  )
}
