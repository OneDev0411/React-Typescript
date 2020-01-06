import React from 'react'
import { Box } from '@material-ui/core'

import Header from './components/Header'
import MediaItem from './components/MediaItem'
import UploadPlaceholderItem from './components/UploadPlaceholderItem'
import BulkActionsMenu from './components/BulkActionsMenu'

import { useStyles } from './styles'

interface Props {}

export default function MediaManager(props: Props) {
  const classes = useStyles()

  return (
    <Box
      className={classes.container}
      border={1}
      bgcolor="#fff"
      borderRadius="4px"
      borderColor="#d4d4d4"
      width={1}
    >
      <Header />
      <Box display="flex" flexWrap="wrap" className={classes.gallery}>
        <UploadPlaceholderItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
        <MediaItem />
      </Box>
      <BulkActionsMenu />
    </Box>
  )
}
