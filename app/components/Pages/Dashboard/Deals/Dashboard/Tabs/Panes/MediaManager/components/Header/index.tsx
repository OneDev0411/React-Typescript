import React from 'react'
import { Typography, Box, Button, useTheme } from '@material-ui/core'
import pluralize from 'pluralize'
import { mdiProgressUpload } from '@mdi/js'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import CreateSyncTask from './CreateSyncTask'

import { useStyles } from '../../styles'

import useMediaManagerContext from '../../hooks/useMediaManagerContext'
import { toggleGallerySelection } from '../../context/actions'

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
  const theme = useTheme()
  const classes = useStyles()
  const { dispatch } = useMediaManagerContext()

  const openBrowse = () => {
    uploaderRef.current.open()
    uploaderRef.current.fileInputEl.click()
  }

  const handleSelectAll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    dispatch(toggleGallerySelection(true))
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
          {' '}
          <Button color="secondary" size="large" onClick={handleSelectAll}>
            Select All
          </Button>
        </Typography>
      </Box>
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="row-reverse"
        className={classes.actionButtons}
      >
        <Button variant="contained" color="secondary" onClick={openBrowse}>
          <SvgIcon
            path={mdiProgressUpload}
            rightMargined
            color={theme.palette.common.white}
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
