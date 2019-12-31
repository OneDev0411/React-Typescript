import React from 'react'
import { Box, Typography, Link } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import Header from './components/Header'
import MediaItem from './components/MediaItem'

interface Props {}

export default function MediaManager(props: Props) {
  return (
    <Box
      border={1}
      py={4}
      px={3}
      bgcolor="#fff"
      borderRadius="3px"
      borderColor="#d4d4d4"
      width={1}
    >
      <Header />
      <Box display="flex" flexWrap="wrap" my={3}>
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
      </Box>
    </Box>
  )
}
