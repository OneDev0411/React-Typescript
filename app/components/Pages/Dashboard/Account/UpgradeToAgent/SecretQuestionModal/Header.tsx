import React from 'react'
import { Box, Typography } from '@material-ui/core'

interface Props {
  title: string
  description: string
}

export function Header({ title, description }: Props) {
  return (
    <Box mb={3}>
      <Typography variant="h4" id="agent-verification-modal-title">
        {title}
      </Typography>
      <Box mb={1} />
      <Typography id="agent-verification-modal-description">
        {description}
      </Typography>
    </Box>
  )
}
