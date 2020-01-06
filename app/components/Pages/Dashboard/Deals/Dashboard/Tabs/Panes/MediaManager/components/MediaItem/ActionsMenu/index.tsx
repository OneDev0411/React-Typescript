import React, { useState } from 'react'
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

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { useStyles } from '../../../styles'

export default function ActionsMenu() {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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
            <IconDownload fill="#fff" className={iconClasses.medium} />
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
          <MoreVertIcon fill="#fff" className={iconClasses.medium} />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Crop</MenuItem>
          <MenuItem onClick={handleClose}>
            <Typography color="error">Delete</Typography>
          </MenuItem>
        </Menu>
      </div>
    </Box>
  )
}
