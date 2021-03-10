import React from 'react'
import { Box, Typography } from '@material-ui/core'

import ShowingList from '../ShowingList'

interface ShowingListWithTitleProps {
  title: string
}

function ShowingListWithTitle({ title }: ShowingListWithTitleProps) {
  return (
    <Box mb={8}>
      <Typography>{title}</Typography>
      <ShowingList />
    </Box>
  )
}

export default ShowingListWithTitle
