import React from 'react'
import { Typography, Box, Button } from '@material-ui/core'
import cn from 'classnames'

import IconUpload from 'components/SvgIcons/Upload/IconUpload'
import IconDropbox from 'components/SvgIcons/Dropbox/IconDropbox'

import { useIconStyles } from 'views/../styles/use-icon-styles'
import { useStyles } from '../../styles'

import { IMediaItem } from '../../types'

interface Props {
  mediaGallery: IMediaItem[]
}

export default function Header({ mediaGallery }: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  return (
    <Box display="flex" width={1} className={classes.header}>
      <Box flexGrow={1}>
        <Typography variant="h6" className={classes.bold}>
          {mediaGallery.length} Photos
          <Typography
            component="span"
            variant="h6"
            className={classes.bold}
            color="textSecondary"
          >
            (Max 50)
          </Typography>
        </Typography>{' '}
      </Box>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="row-reverse"
        className={classes.actionButtons}
      >
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className={classes.lowerCaseButton}
        >
          <IconUpload
            fillColor="#fff"
            className={cn(iconClasses.small, iconClasses.rightMargin)}
          />{' '}
          Upload
        </Button>
        <Button
          variant="outlined"
          disableElevation
          className={classes.lowerCaseButton}
        >
          <IconDropbox
            fillColor="#000"
            className={cn(iconClasses.small, iconClasses.rightMargin)}
          />{' '}
          Dropbox Import
        </Button>
      </Box>
    </Box>
  )
}
