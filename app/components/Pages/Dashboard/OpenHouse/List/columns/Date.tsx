import React from 'react'

import { Typography } from '@material-ui/core'
import fecha from 'fecha'

interface Props {
  dueDate: number
}

export default function Info({ dueDate }: Props) {
  const date = fecha.format(
    new Date(dueDate * 1000),
    'ddd, MMM DD, YYYY. hh:mma'
  )

  return (
    <Typography variant="body2" noWrap>
      {date}
    </Typography>
  )
}
