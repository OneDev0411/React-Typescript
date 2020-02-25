import React from 'react'
import fecha from 'fecha'
import { Link, Typography } from '@material-ui/core'

interface Props {
  dueDate: number
  onClick: (rowDate) => void
}

export default function DueDate({ dueDate, onClick }: Props) {
  const date = fecha.format(
    new Date(dueDate * 1000),
    'dddd MMM DD, YYYY hh:mma'
  )

  return (
    <>
      <Link role="button" onClick={onClick}>
        {date}
      </Link>
    </>
  )
}
