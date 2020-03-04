import React from 'react'
import { Typography } from '@material-ui/core'

interface Props {
  description: string
  title: string
}

export default function Info({ title, description }: Props) {
  return (
    <>
      <Typography variant="body2" noWrap>
        {title}
        {/* {description && (
          <Typography variant="inherit" color="inherit">
            {description}
          </Typography>
        )} */}
      </Typography>
    </>
  )
}
