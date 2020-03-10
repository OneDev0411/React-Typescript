import React from 'react'
import { Typography } from '@material-ui/core'

interface Props {
  title: string
}

export default function Title({ title }: Props) {
  return (
    <Typography variant="body2" noWrap>
      {title}
    </Typography>
  )
}
