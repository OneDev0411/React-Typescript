import React from 'react'
import { Button } from '@material-ui/core'

interface IProps {}

export function CreateEvent(props: IProps) {
  return (
    <div>
      <Button
        color="primary"
        variant="contained"
        size="medium"
        onClick={() => {}}
      >
        Create Event
      </Button>
    </div>
  )
}
