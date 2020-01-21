import React, { useState, useContext } from 'react'
import {
  Tooltip,
  Button,
  Typography,
  Box,
  Menu,
  MenuItem
} from '@material-ui/core'

import { deleteMedias } from 'models/media-manager'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import MoreVertIcon from 'components/SvgIcons/VeriticalDots/VerticalDotsIcon'
import IconDownload from 'components/SvgIcons/Download/IconDownload'

import { useIconStyles } from 'views/../styles/use-icon-styles'

import { useStyles } from '../../../styles'

import useMediaManagerContext from '../../../hooks/useMediaManagerContext'
import { IMediaItem } from '../../../types'
import { deleteMedia as deleteMediaAction } from '../../../context/actions'

export default function ActionsMenu({
  media,
  deal
}: {
  media: IMediaItem
  deal: IDeal
}) {
  const classes = useStyles()
  const iconClasses = useIconStyles()

  const [anchorEl, setAnchorEl] = useState(null)
  const { dispatch } = useMediaManagerContext()
  const confirmationModal = useContext(ConfirmationModalContext)
  const { file } = media

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    confirmationModal.setConfirmationModal({
      message: 'Remove Image?',
      description: 'This action can not be undone. Are you sure?',
      confirmLabel: 'Yes, Please',
      onConfirm: async () => {
        deleteMedias(deal.id, [file])
        dispatch(deleteMediaAction(file))
        handleClose()
      }
    })
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
