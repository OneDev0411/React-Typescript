import React from 'react'

import fecha from 'fecha'

import { Button } from '@material-ui/core'

interface IProps {
  onClick(): void
}

export function TodayButton(props: IProps) {
  return (
    <Button
      size="small"
      variant="outlined"
      color="secondary"
      onClick={props.onClick}
      data-balloon={fecha.format(new Date(), 'dddd, MMMM DD')}
      data-balloon-pos="down"
    >
      Today
    </Button>
  )
}
