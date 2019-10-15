import React from 'react'
import fecha from 'fecha'
import { Link, Typography } from '@material-ui/core'

interface Props {
  description: string
  dueDate: number
  onClick: (rowDate) => void
  title: string
}

export default function Info({ title, description, dueDate, onClick }: Props) {
  const date = fecha.format(
    new Date(dueDate * 1000),
    'dddd, MMM DD YYYY hh:mm A'
  )

  return (
    <>
      <Typography variant="button" noWrap>
        <Link role="button" onClick={onClick} color="inherit">
          {date}
        </Link>
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
