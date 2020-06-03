import React, { useContext, useRef } from 'react'
import { Box } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { addNotification } from 'reapop'

import { uploadMedia } from 'models/media-manager'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import LoadingContainer from 'components/LoadingContainer'

import acceptedDocuments from './constants/acceptedDocuments'
import Uploader, { DropzoneRef } from './components/MediaUploader'
import Header from './components/Header'
import BulkActionsMenu from './components/BulkActionsMenu'
import Gallery from './components/Gallery'
import { getUploadedMedia, getSelectedMedia } from './context/helpers/selectors'
import { useStyles } from './styles'
import { MediaManagerContext } from './context'
import useFetchGallery from './hooks/useFetchGallery'
import {
  addMedia,
  setMediaUploadProgress,
  setMediaAsUploaded,
  setNewlyUploadedMediaFields
} from './context/actions'

interface Props {
  user: IUser
  deal: IDeal
}

export default function MediaManager({ user, deal }: Props) {
  const classes = useStyles()
  const reduxDispatch = useDispatch()
  const uploaderRef = useRef<DropzoneRef>(null)

  const { isLoading, state, dispatch } = useFetchGallery(deal.id)
  const confirmationModal = useContext(ConfirmationModalContext)
  const upload = async (fileObject, order) => {
    try {
      const response = await uploadMedia(
        deal.id,
        fileObject,
        '',
        order,
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
      const { id: file, name } = response
      const { preview_url: src } = response.file

      dispatch(setNewlyUploadedMediaFields(fileObject.name, file, src, name))
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
  const onDrop = (files: any[], rejectedFiles: []) => {
    if (rejectedFiles.length > 0) {
      confirmationModal.setConfirmationModal({
        message: `${rejectedFiles.length} unsupported files dropped!`,
        description: `Some of your files are not supported.
        You should only drop files with the following formats:
        ${acceptedDocuments}`,
        confirmLabel: 'Got it',
        needsCancel: false
      })
    }

    let nextOrder =
      Math.max(...state.map(galleryItem => galleryItem.order), -1) + 1

    files.forEach(file => {
      // dispatch(addMedia({ file, order: nextOrder }))
      // upload(file, nextOrder)
      // nextOrder += 1
      console.log(file)
    })
  }

  if (isLoading) {
    return (
      <Box className={classes.container} width={1}>
        <LoadingContainer style={{ height: '50vh' }} />
      </Box>
    )
  }

  return (
    <Uploader onDrop={onDrop} disableClick ref={uploaderRef}>
      <MediaManagerContext.Provider value={{ state, dispatch }}>
        <Box className={classes.container} width={1}>
          <Header
            mediasCount={getUploadedMedia(state).length}
            uploaderRef={uploaderRef}
            deal={deal}
            user={user}
          />
          <Gallery medias={state} deal={deal} uploaderRef={uploaderRef} />
          {getSelectedMedia(state).length > 0 && (
            <BulkActionsMenu mediaGallery={state} deal={deal} />
          )}
        </Box>
      </MediaManagerContext.Provider>
    </Uploader>
  )
}
