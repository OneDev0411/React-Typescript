import React from 'react'
import Flex from 'styled-flex-component'
import { Typography } from '@material-ui/core'

export default function NoResults() {
  return (
    <Flex alignCenter>
      <Typography variant="body1">
        No images found. Please try searching something else.
      </Typography>
    </Flex>
  )
}
