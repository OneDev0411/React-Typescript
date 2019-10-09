import React from 'react'
import fecha from 'fecha'
import { Typography } from '@material-ui/core'

interface Props {
  description: string
  dueDate: number
  title: string
}

export default function Info({ title, description, dueDate }: Props) {
  const date = fecha.format(
    new Date(dueDate * 1000),
    'dddd, MMM DD YYYY hh:mm A'
  )

  return (
    <>
      <Typography variant="button" noWrap>
        {date}
      </Typography>
      <Typography variant="body2" color="textSecondary" noWrap>
        {title}
        {description && (
          <Typography variant="inherit" color="inherit">
            &nbsp;&nbsp;|&nbsp;&nbsp;{description}
          </Typography>
        )}
      </Typography>
    </>
  )
}
