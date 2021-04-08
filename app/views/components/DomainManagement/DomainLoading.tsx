import React from 'react'
import { Box, CircularProgress } from '@material-ui/core'

function DomainLoading() {
  return (
    <Box marginTop={3} marginBottom={3} textAlign="center">
      <CircularProgress />
    </Box>
  )
}

export default DomainLoading
