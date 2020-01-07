import React from 'react'
import { Typography, Box } from '@material-ui/core'
import cn from 'classnames'

import ActionsMenu from './ActionsMenu'
import SelectCheckbox from './SelectCheckbox'

import { useStyles } from '../../styles'
import { IMediaItem } from '../../types'

export default function MediaItem(props: IMediaItem) {
  const classes = useStyles()
  const { src, selected } = props

  return (
    <Box className={cn(classes.mediaCard, {'selected': selected})}>
      <Box className={classes.mediaThumbnailContainer}>
        <img src={src} className={classes.mediaThumbnail} alt="" />
        <SelectCheckbox {...props} />
        <ActionsMenu />
      </Box>
      <Typography variant="body1" className={classes.trimmedText}>
        This flexibility allows integrating React into projects with existing
        conventions. But it also invites endless debates.
      </Typography>
    </Box>
  )
}
