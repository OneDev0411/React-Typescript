import React from 'react'
import { Link } from '@material-ui/core'

interface Props {
  title: string
  onClick: (rowDate) => void
}

export default function Title({ title, onClick }: Props) {
  return (
    <Link role="button" onClick={onClick} color="inherit">
      {title}
    </Link>
  )
}
