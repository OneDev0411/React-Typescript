import React from 'react'
import { Button } from '@material-ui/core'

interface Props {
  onViewToursheet: () => void
}

export default function Actions({ onViewToursheet }: Props) {
  return (
    <Button variant="outlined" onClick={onViewToursheet}>
      View Toursheet
    </Button>
  )
}
