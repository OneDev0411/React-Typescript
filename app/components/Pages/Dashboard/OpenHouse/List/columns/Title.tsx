import React from 'react'
import { Link, Typography } from '@material-ui/core'

interface Props {
  title: string
  description: string
  onClick: (rowDate) => void
}

export default function Title({ title, description, onClick }: Props) {
  return (
    <>
      <Link role="button" onClick={onClick} color="inherit">
        {title}
      </Link>
      <Typography variant="body2" color="textSecondary" noWrap>
        {description && (
          <Typography variant="inherit" color="inherit">
            {description}
          </Typography>
        )}
      </Typography>
    </>
  )
}
