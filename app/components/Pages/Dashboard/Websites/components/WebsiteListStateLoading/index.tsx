import React from 'react'

import { Box } from '@material-ui/core'

import Loading from 'components/LoadingContainer'

function WebsiteListStateLoading() {
  return (
    <Box height="30vh" justifyContent="center">
      <Loading style={{ padding: '5rem 0' }} />
    </Box>
  )
}

export default WebsiteListStateLoading
