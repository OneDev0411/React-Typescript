import React, { useContext } from 'react'
import { Box } from '@material-ui/core'

import { uploadMedia } from 'models/media-manager'

import LoadingContainer from 'components/LoadingContainer'

import ConfirmationModalContext from 'components/ConfirmationModal/context'

import acceptedDocuments from './constants/acceptedDocuments'

import Uploader from './components/MediaUploader'
import { getUploadedMedia, getSelectedMedia } from './context/helpers/selectors'

import Header from './components/Header'

import BulkActionsMenu from './components/BulkActionsMenu'
import Gallery from './components/Gallery'

import { useStyles } from './styles'
import { MediaManagerContext } from './context'

import useFetchGallery from './hooks/useFetchGallery'

import {
  addMedia,
  setMediaUploadProgress,
  setMediaAsUploaded,
  setNewlyUploadedMediaFields
} from './context/actions'

export default function MediaManager({ deal }: { deal: IDeal }) {
  const classes = useStyles()

  const { isLoading, state, dispatch } = useFetchGallery(deal.id)
  const confirmationModal = useContext(ConfirmationModalContext)

  const upload = async fileObject => {
    const response = await uploadMedia(
      deal.id,
      fileObject,
      '',
      progressEvent => {
        if (progressEvent.percent) {
          dispatch(
            setMediaUploadProgress(fileObject.name, progressEvent.percent)
          )
        } else {
          dispatch(setMediaAsUploaded(fileObject.name))
        }
      }
    )

    const uploadedFileObject = response.body.references.file

    // I know this is ugly! That's the format of data returned from server!
    const fileKey = Object.keys(uploadedFileObject)[0]
    const { id: file, preview_url: src, name } = uploadedFileObject[fileKey]

    dispatch(setNewlyUploadedMediaFields(fileObject.name, file, src, name))
  }

  const onDrop = (files: any[], rejectedFiles: []) => {
    if (rejectedFiles.length > 0) {
      confirmationModal.setConfirmationModal({
        message: 'Unsupported Files dropped',
        description: `Some of your files are not supported.
        You should only drop files with the following formats:
        ${acceptedDocuments}`,
        confirmLabel: 'Got it',
        needsCancel: false
      })
    }

    files.forEach(file => {
      dispatch(addMedia(file))
      upload(file)
    })
  }

  if (isLoading) {
    return (
      <Box className={classes.container} width={1}>
        <LoadingContainer
          style={{
            height: '50vh'
          }}
        />
      </Box>
    )
  }

  return (
    <Uploader onDrop={onDrop} disableClick>
      <MediaManagerContext.Provider value={{ state, dispatch }}>
        <Box className={classes.container} width={1}>
          <Header mediasCount={getUploadedMedia(state).length} />
          <Gallery medias={state} deal={deal} />
          {getSelectedMedia(state).length > 0 && (
            <BulkActionsMenu mediaGallery={state} deal={deal} />
          )}
        </Box>
      </MediaManagerContext.Provider>
    </Uploader>
  )
}
