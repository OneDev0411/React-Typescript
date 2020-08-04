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

import { useDispatch } from 'react-redux'

import { addNotification } from 'reapop'

import { uploadCroppedMedia } from 'models/media-manager'
import { downloadMedias } from 'models/media-manager'

import { ImageUploader } from 'components/ImageUploader'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { deleteMedias } from 'models/media-manager'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import DownloadModal from '../../DownloadModal'

import { useStyles } from '../../../styles'

import useMediaManagerContext from '../../../hooks/useMediaManagerContext'
import type { IMediaItem } from '../../../types'

import {
  setMediaUploadProgress,
  deleteMedia as deleteMediaAction,
  setNewlyUploadedMediaFields,
  setMediaAsUploaded
} from '../../../context/actions'

interface Props {
  media: IMediaItem
  deal: IDeal
}

export default function ActionsMenu({ media, deal }: Props) {
  const theme = useTheme()
  const classes = useStyles()
  const reduxDispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [isCropperOpen, setIsCropperOpen] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const { dispatch } = useMediaManagerContext()
  const confirmationModal = useContext(ConfirmationModalContext)
  const { id, src, name } = media
  const fileExtension = src.substr(src.lastIndexOf('.'), 4)

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

  const hideCropper = () => {
    setIsCropperOpen(false)
  }

  const onCrop = ({ files }) => {
    const fileName = files.originalFile.split('?')[0].split('/').pop()
    const croppedFile = new File([files.file], fileName)

    upload(croppedFile)
  }

  const upload = async fileObject => {
    try {
      const response = await uploadCroppedMedia(
        deal.id,
        media.id,
        fileObject,
        `${media.name}.${fileExtension}`,
        progressEvent => {
          if (progressEvent.percent) {
            dispatch(setMediaUploadProgress(id, progressEvent.percent))
          } else {
            dispatch(setMediaAsUploaded(id))
          }
        }
      )

      const { preview_url: src } = response

      dispatch(setNewlyUploadedMediaFields(id, id, src))
    } catch (err) {
      console.log(err)
      reduxDispatch(
        addNotification({
          status: 'error',
          message:
            'Something went wrong while uploading your photo. Please try again.'
        })
      )
    }
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
        {isCropperOpen && (
          <ImageUploader
            disableChangePhoto
            file={src}
            width={287}
            height={287}
            saveHandler={onCrop}
            closeHandler={hideCropper}
          />
        )}
      </Box>
      <DownloadModal
        isOpen={modalIsOpen}
        link={downloadUrl}
        onClose={handleModalClose}
      />
    </>
  )
}
