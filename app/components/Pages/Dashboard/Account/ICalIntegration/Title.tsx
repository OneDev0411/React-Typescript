import React from 'react'
import { Box, Typography } from '@material-ui/core'

interface Props {
  children: string
}

export default function Title({ children }: Props) {
  return (
    <Box marginBottom={1}>
      <Typography variant="h6">{children}</Typography>
    </Box>
  )
}
