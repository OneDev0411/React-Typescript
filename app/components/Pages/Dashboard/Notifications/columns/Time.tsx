import React from 'react'
import { Typography } from '@material-ui/core'
import timeago from 'timeago.js'

interface Props {
  date: number
}

export default function Message({ date }: Props) {
  return (
    <Typography variant="body2" color="textSecondary">
      {timeago().format(date * 1000)}
    </Typography>
  )
}
