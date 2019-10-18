import React from 'react'
import { Button } from '@material-ui/core'

interface Props {
  onOpenDrawer: () => void
}

export default function CreateNewTour(props: Props) {
  return (
    <>
      <Button color="primary" variant="contained" onClick={props.onOpenDrawer}>
        Create a Toursheet
      </Button>
    </>
  )
}
