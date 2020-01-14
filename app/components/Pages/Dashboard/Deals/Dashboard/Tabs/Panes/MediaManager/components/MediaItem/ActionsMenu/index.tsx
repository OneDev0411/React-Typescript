import React, { useState, useContext } from 'react'
import {
  Tooltip,
  Button,
  Typography,
  Box,
  Menu,
  MenuItem
} from '@material-ui/core'

import MoreVertIcon from 'components/SvgIcons/VeriticalDots/VerticalDotsIcon'
import IconDownload from 'components/SvgIcons/Download/IconDownload'

import { useStyles } from '../../../styles'
import { useIconStyles } from 'views/../styles/use-icon-styles'

import { MediaManagerAPI } from '../../../context'
import { IMediaItem } from '../../../types'
import { deleteMedia } from '../../../context/actions'

export default function ActionsMenu(props: IMediaItem) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const { dispatch } = useContext(MediaManagerAPI)
  const { file } = props

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    let confirm = window.confirm('This action can not be undone. Are you sure?')
    if (confirm) {
      dispatch(deleteMedia(file))
      handleClose()
    } else {
      handleClose()
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="row-reverse"
      flexWrap="nowrap"
      justifyContent="space-between"
      className={classes.actions}
    >
      <div>
        <Tooltip title="Download Image">
          <Button
            color="secondary"
            variant="contained"
            size="small"
            className={classes.menuButton}
          >
            <IconDownload
              fill="#fff"
              className={(iconClasses.medium, classes.iconButton)}
            />
          </Button>
        </Tooltip>
        <Button
          color="secondary"
          variant="contained"
          size="small"
          className={classes.menuButton}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon
            fill="#fff"
            className={(iconClasses.medium, classes.iconButton)}
          />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Crop</MenuItem>
          <MenuItem onClick={handleDelete}>
            <Typography color="error">Delete</Typography>
          </MenuItem>
        </Menu>
      </div>
    </Box>
  )
}
