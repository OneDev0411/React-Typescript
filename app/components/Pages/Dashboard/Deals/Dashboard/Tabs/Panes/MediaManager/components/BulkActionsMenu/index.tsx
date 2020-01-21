import React, { useContext, useState } from 'react'
import { Typography, Box, Button, Checkbox, Link } from '@material-ui/core'
import pluralize from 'pluralize'

import { deleteMedias, downloadMedias } from 'models/media-manager'

import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { DangerButton } from 'components/Button/DangerButton'

import DownloadModal from './DownloadModal'

import { useStyles } from '../../styles'
import { MediaManagerAPI } from '../../context'
import { IMediaGallery } from '../../types'
import {
  toggleGallerySelection,
  deleteMedias as deleteMediasAction
} from '../../context/actions'
import {
  getSelectedMedia,
  getSelectedMediaIds
} from '../../context/helpers/selectors'

interface Props {
  mediaGallery: IMediaGallery
  deal: IDeal
}

export default function BulkActionsMenu({ mediaGallery, deal }: Props) {
  const classes = useStyles()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const selectedGalleryItems = getSelectedMedia(mediaGallery)
  const { dispatch } = useContext(MediaManagerAPI)
  const confirmationModal = useContext(ConfirmationModalContext)

  const handleModalClose = () => {
    setModalIsOpen(false)
  }

  const handleSelectAll = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    dispatch(toggleGallerySelection(true))
  }
  const handleSelectNone = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    dispatch(toggleGallerySelection(false))
  }

  const handleDownloadSelected = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    const url = await downloadMedias(
      deal.id,
      getSelectedMediaIds(selectedGalleryItems)
    )

    setDownloadUrl(url)
    setModalIsOpen(true)
  }

  const handleDeleteSelected = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()

    confirmationModal.setConfirmationModal({
      message: `Delete ${pluralize(
        'photo',
        selectedGalleryItems.length,
        true
      )}?`,
      description: 'This action can not be undone. Are you sure?',
      confirmLabel: 'Yes, Please',
      onConfirm: async () => {
        deleteMedias(deal.id, getSelectedMediaIds(selectedGalleryItems))
        dispatch(deleteMediasAction(getSelectedMediaIds(selectedGalleryItems)))
      }
    })
  }

  return (
    <>
      <Box
        display="flex"
        width={1}
        className={classes.bulkActionsMenu}
        p={2}
        borderColor="#d4d4d4"
      >
        <Box flexGrow={1}>
          <Checkbox
            color="primary"
            onChange={handleSelectNone}
            checked={selectedGalleryItems.length === mediaGallery.length}
            indeterminate={
              selectedGalleryItems.length > 0 &&
              selectedGalleryItems.length !== mediaGallery.length
            }
          />
          <Typography display="inline" className={classes.bold}>
            {pluralize('photo', selectedGalleryItems.length, true)} selected
          </Typography>

          {selectedGalleryItems.length !== mediaGallery.length && (
            <>
              <Typography
                display="inline"
                variant="body2"
                color="textSecondary"
              >
                &nbsp;&#9679;&nbsp;
              </Typography>
              <Link href="#" onClick={handleSelectAll}>
                Select all {pluralize('photo', mediaGallery.length, true)}
              </Link>
            </>
          )}
        </Box>
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="row-reverse"
          className={classes.actionButtons}
        >
          <Button
            variant="outlined"
            disableElevation
            className={classes.lowerCaseButton}
            onClick={handleDownloadSelected}
          >
            Download {pluralize('photo', selectedGalleryItems.length, true)}
          </Button>
          <DangerButton
            variant="outlined"
            disableElevation
            className={classes.lowerCaseButton}
            onClick={handleDeleteSelected}
          >
            Delete {pluralize('photo', selectedGalleryItems.length, true)}
          </DangerButton>
        </Box>
      </Box>
      <DownloadModal
        isOpen={modalIsOpen}
        link={downloadUrl}
        onClose={handleModalClose}
      />
    </>
  )
}
