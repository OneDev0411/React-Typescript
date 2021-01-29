import React from 'react'
import { Box } from '@material-ui/core'

import LoadingContainer from 'components/LoadingContainer'

export default function Loading() {
  return (
    <Box width="100%" height="100%">
      <LoadingContainer style={{ padding: '20%' }} noPaddings />
    </Box>
  )
}
