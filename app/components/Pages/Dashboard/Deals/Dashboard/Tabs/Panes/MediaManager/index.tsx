import React, { useContext, useRef, useState } from 'react'
import { Box, RootRef } from '@material-ui/core'
import { useDispatch } from 'react-redux'

import { addNotification } from 'components/notification'

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
  const pageBottom = useRef<HTMLDivElement>(null)
  const [sortEnabled, setSortEnabled] = useState(true)
  const [, setCurrentlyUploadingPhotos] = useState(0)
  const { isLoading, state, dispatch } = useFetchGallery(deal.id)
  const confirmationModal = useContext(ConfirmationModalContext)

  const scrollToBottom = () => {
    pageBottom.current!.scrollIntoView({ behavior: 'smooth' })
  }

  const upload = async (fileObject, order: number) => {
    try {
      const response = await uploadMedia(
        deal.id,
        fileObject,
        null,
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
      const { id } = response
      const { preview_url: src } = response.file

      setCurrentlyUploadingPhotos(CurrentlyUploadingPhotos => {
        const newState = CurrentlyUploadingPhotos - 1

        if (newState === 0) {
          // no files are remaining for upload
          setSortEnabled(true)
        }

        return newState
      })

      dispatch(setNewlyUploadedMediaFields(fileObject.name, id, src))
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
  const onDrop = (fileObjects: any[], rejectedFiles: []) => {
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

    // Upon uploading new photos we need to calculate the correct order of that item
    // so that the next time user visits the page, he sees them with that exact same
    // order.
    // The rule is, new photos are *appended* to the gallery and since the user needs
    // to see the upload process, we'll scroll all the way down to the bottom when he
    // drops the files.
    let order = state.length
      ? Math.max(...state.map(galleryItem => galleryItem.order)) + 1
      : 0

    setSortEnabled(false)
    scrollToBottom()

    fileObjects.forEach(fileObject => {
      dispatch(addMedia({ fileObject, order }))
      upload(fileObject, order)
      setCurrentlyUploadingPhotos(
        CurrentlyUploadingPhotos => CurrentlyUploadingPhotos + 1
      )
      order++
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
          <Gallery
            medias={state}
            deal={deal}
            uploaderRef={uploaderRef}
            sortEnabled={sortEnabled}
          />
          {getSelectedMedia(state).length > 0 && (
            <BulkActionsMenu mediaGallery={state} deal={deal} />
          )}
        </Box>
        <RootRef rootRef={pageBottom}>
          <Box />
        </RootRef>
      </MediaManagerContext.Provider>
    </Uploader>
  )
}
