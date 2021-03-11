import React, { ReactNode } from 'react'
import { Box, Typography } from '@material-ui/core'

interface BoxWithTitleProps {
  title: string
  children: ReactNode
}

function BoxWithTitle({ title, children }: BoxWithTitleProps) {
  return (
    <Box mb={5}>
      <Box mb={2}>
        <Typography variant="h5">{title}</Typography>
      </Box>
      {children}
    </Box>
  )
}

export default BoxWithTitle
