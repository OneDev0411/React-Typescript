import React, { MouseEvent } from 'react'
import { Button } from '@material-ui/core'

interface Props {
  onMouseEnter: (event: MouseEvent<HTMLElement>) => void
}

export default function GlobalActionsMenu({ onMouseEnter }: Props) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onMouseEnter}
      onMouseEnter={onMouseEnter}
    >
      Actions
    </Button>
  )
}
