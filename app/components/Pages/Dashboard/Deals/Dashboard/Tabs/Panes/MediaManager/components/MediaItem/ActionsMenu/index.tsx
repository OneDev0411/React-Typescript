import React, { useState, useContext } from 'react'
import {
  Tooltip,
  Button,
  Typography,
  Box,
  Menu,
  MenuItem,
  useTheme
} from '@material-ui/core'
import { mdiDotsVertical, mdiDownload } from '@mdi/js'

import { downloadMedias } from 'models/Deal/media-manager'

import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { deleteMedias } from 'models/Deal/media-manager'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import DownloadModal from '../../DownloadModal'

import { useStyles } from '../../../styles'

import useMediaManagerContext from '../../../hooks/useMediaManagerContext'
import type { IMediaItem } from '../../../types'

import { deleteMedia as deleteMediaAction } from '../../../context/actions'

interface Props {
  media: IMediaItem
  deal: IDeal
}

export default function ActionsMenu({ media, deal }: Props) {
  const theme = useTheme()
  const classes = useStyles()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const { dispatch } = useMediaManagerContext()
  const confirmationModal = useContext(ConfirmationModalContext)
  const { id } = media

  const handleModalClose = () => {
    setModalIsOpen(false)
    setDownloadUrl('')
  }
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDownload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const url = await downloadMedias(deal.id, [media.id])

    setDownloadUrl(url)
    setModalIsOpen(true)
  }

  const handleDelete = () => {
    handleClose()
    confirmationModal.setConfirmationModal({
      message: 'Remove Image?',
      description: 'This action can not be undone. Are you sure?',
      confirmLabel: 'Yes, Please',
      onConfirm: () => {
        deleteMedias(deal.id, [id])
        dispatch(deleteMediaAction(id))
      }
    })
  }

  return (
    <>
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
              onClick={handleDownload}
            >
              <SvgIcon
                path={mdiDownload}
                color={theme.palette.common.white}
                className={classes.iconButton}
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
            onClick={handleMenuClick}
          >
            <SvgIcon
              path={mdiDotsVertical}
              color={theme.palette.common.white}
              className={classes.iconButton}
            />
          </Button>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleDelete}>
              <Typography color="error">Delete</Typography>
            </MenuItem>
          </Menu>
        </div>
      </Box>
      <DownloadModal
        isOpen={modalIsOpen}
        link={downloadUrl}
        onClose={handleModalClose}
      />
    </>
  )
}
