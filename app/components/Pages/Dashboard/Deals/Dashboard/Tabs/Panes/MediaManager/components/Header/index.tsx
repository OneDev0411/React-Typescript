import React from 'react'
import { Typography, Box, Button } from '@material-ui/core'
import cn from 'classnames'
import pluralize from 'pluralize'

import IconUpload from 'components/SvgIcons/Upload/IconUpload'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import CreateSyncTask from './CreateSyncTask'

import { useStyles } from '../../styles'

interface Props {
  mediasCount: number
  uploaderRef: React.RefObject<any>
  deal: IDeal
  user: IUser
}

export default function Header({
  mediasCount,
  uploaderRef,
  deal,
  user
}: Props) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const openBrowse = () => {
    uploaderRef.current.open()
  }

  return (
    <Box display="flex" width={1} className={classes.header}>
      <Box flexGrow={1}>
        <Typography variant="h6" className={classes.bold} display="inline">
          {pluralize('photo', mediasCount, true)}
        </Typography>{' '}
        <Typography
          variant="h6"
          className={classes.bold}
          color="textSecondary"
          display="inline"
        >
          (Max 50)
        </Typography>
      </Box>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="row-reverse"
        className={classes.actionButtons}
      >
        <Button variant="contained" color="secondary" onClick={openBrowse}>
          <IconUpload
            fillColor="#fff"
            className={cn(iconClasses.small, iconClasses.rightMargin)}
          />{' '}
          Upload
        </Button>
        {!deal.is_draft && <CreateSyncTask deal={deal} user={user} />}
        {/* <Button
          variant="outlined"
          disableElevation
          disabled
          className={classes.lowerCaseButton}
        >
          <IconDropbox
            fillColor="#000"
            className={cn(iconClasses.small, iconClasses.rightMargin)}
          />{' '}
          Dropbox Import
        </Button> */}
      </Box>
    </Box>
  )
}
